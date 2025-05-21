const { ERR, SUC } = require("../utils/response");
const cloudinary = require('../config/cloudinary');
const { Article, User } = require("../models/index.model");

const AddArticle = async (req, res) => {
    const coverFile = req.files?.["cover"]?.[0];
    const cover = coverFile ? `${coverFile.filename}` : null;

    let { title, content, description, createdBy, tags } = req.body;

    try {
        if (!title || !content || !createdBy) {
            return ERR(res, 400, "Required data is missing");
        }

        if (typeof tags === "string") {
            tags = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
        }

        if (typeof content === "string") {
            try {
                content = JSON.parse(content);
                if (!Array.isArray(content)) throw new Error();
            } catch {
                return ERR(res, 400, "Content harus berupa JSON array yang valid");
            }
        };

        const imageFiles = req.files['image'] || [];
        let imageIndex = 0;

        content = content.map((item, idx) => {
            if (item.type === "image") {
                const imageFile = imageFiles[imageIndex++];
                if (imageFile) {
                    item.value = imageFile.filename;
                } else {
                    return ERR(res, 400, `Konten image di index ${idx} tidak memiliki file yang diupload`);
                }
            }
            return item;
        });

        const newArticle = new Article({
            cover,
            title,
            description,
            content,
            createdBy,
            tags,
        });

        await newArticle.save();

        return SUC(res, 201, newArticle, "Article created successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    }
};

const GetArticle = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;
        
        const totalArticles = await Article.countDocuments();

        const articles = await Article.find()
            .populate("createdBy", "username email role profilePicture provider")
            .populate("comments.user", "email username profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!articles) return ERR(res, 404, "Article not found");

        return SUC(res, 200, {
            article: articles,
            pagination: {
                total: totalArticles,
                page,
                limit,
                totalPages: Math.ceil(totalArticles / limit)
            }
        }, "Success getting articles");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
};

const GetArticleById = async (req, res) => {
    const articleId = req.params.id;

    try {
        if (!articleId) return ERR(res, 200, "Data not found");

        const article = await Article.findById(articleId)
            .populate("createdBy", "uid username email role profilePicture provider")
            .populate("comments.user", "email username profilePicture");

        if (!article) return ERR(res, 404, "Article not found");

        return SUC(res, 200, article, "Success getting data");
    } catch (error) {
        console.error(error);
        return (res, 500, "Error getting data");
    }
};

const UpdateArticle = async (req, res) => {
    const articleId = req.params.id;
    const coverFile = req.files?.["cover"]?.[0];

    let { title, content, description, tags, newContentImages } = req.body;
    
    try {
        const article = await Article.findById(articleId);
        if (!article) return ERR(res, 404, "Article not found");
        
        if (typeof tags === "string") {
            tags = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
        
        if (typeof content === "string") {
            try {
                content = JSON.parse(content);
                if (!Array.isArray(content)) {
                    return ERR(res, 400, "Content harus berupa JSON array yang valid");
                }
            } catch (error) {
                return ERR(res, 400, "Content harus berupa JSON array yang valid");
            }
        }
        
        if (typeof newContentImages === "string") {
            try {
                newContentImages = JSON.parse(newContentImages);
            } catch (error) {
                newContentImages = [];
                console.error("Error parsing newContentImages:", error);
            }
        }
        
        if (coverFile) {
            if (article.cover) {
                try {
                    if (!article.cover.includes("__IMAGE_PLACEHOLDER_")) {
                        await cloudinary.uploader.destroy(article.cover);
                    }
                } catch (error) {
                    console.error("Error deleting old cover:", error);
                }
            }
            article.cover = coverFile.filename;
        }
        
        const oldImageValues = article.content
            .filter(item => item.type === "image")
            .map(item => item.value);
            
        const newImageValues = content
            .filter(item => item.type === "image" && !item.value.includes("__IMAGE_PLACEHOLDER_"))
            .map(item => item.value);
            
        const imagesToDelete = oldImageValues.filter(value => !newImageValues.includes(value));
        
        for (const publicId of imagesToDelete) {
            try {
                if (publicId.includes("__IMAGE_PLACEHOLDER_")) continue;
                
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error(`Error deleting image with public ID ${publicId}:`, error);
            }
        }
        
        const imageFiles = req.files["image"] || [];
        
        const imageMap = {};
        if (Array.isArray(newContentImages)) {
            newContentImages.forEach((item, index) => {
                if (imageFiles[index]) {
                    imageMap[`__IMAGE_PLACEHOLDER_${item.name}__`] = imageFiles[index].filename;
                }
            });
        }
        
        const updatedContent = [];
        
        for (let i = 0; i < content.length; i++) {
            const item = content[i];
            
            if (item.type === "image") {
                if (item.value.includes("__IMAGE_PLACEHOLDER_")) {
                    const newPublicId = imageMap[item.value];
                    if (newPublicId) {
                        updatedContent.push({
                            ...item,
                            value: newPublicId
                        });
                    } else {
                        return ERR(res, 400, `Gambar untuk konten index ${i} tidak ditemukan`);
                    }
                } else {
                    updatedContent.push(item);
                }
            } else {
                updatedContent.push(item);
            }
        }
        
        article.title = title || article.title;
        article.description = description || article.description;
        article.content = updatedContent;
        article.tags = tags || article.tags;
        
        await article.save();
        return SUC(res, 200, article, "Article updated successfully");
    } catch (error) {
        console.error("Error updating article:", error);
        return ERR(res, 500, "Update error: " + error.message);
    }
};

const DeleteArticle = async (req, res) => {
    const articleId = req.params.id;

    try {
        if (!articleId) return ERR(res, 400, "Article id is required");

        const article = await Article.findById(articleId);
        if (!article) return ERR(res, 404, "Article not found");

        if (article.cover) {
            try {
                await cloudinary.uploader.destroy(article.cover);
            } catch (error) {
                console.error(`Error deleting cover image: ${article.cover}`, error);
            }
        }

        if (Array.isArray(article.content)) {
            const deletePromises = article.content
                .filter(item => item.type === "image" && item.value)
                .map(async item => {
                    try {
                        await cloudinary.uploader.destroy(item.value);
                    } catch (error) {
                        console.error(`Error deleting content image: ${item.value}`, error);
                    }
                });
            
            await Promise.allSettled(deletePromises);
        }

        await Article.findByIdAndDelete(articleId);
        return SUC(res, 204, null, "Article removed successfully");
    } catch (error) {
        console.error("Error deleting article:", error);
        return ERR(res, 500, "Remove error: " + error.message);
    }
};

const LikeArticle = async (req, res) => {
    const { articleId, userId, anonymousId } = req.body;

    try {
        if (!userId && !anonymousId) return ERR(res, 400, "User ID or anonymous ID required");

        const article = await Article.findById(articleId);
        if (!article) return ERR(res, 404, "Article not found");

        const alreadyLiked = article.likes.some(like =>
            (userId && like.userId?.toString() === userId) ||
            (anonymousId && like.anonymousId === anonymousId)
        );

        if (alreadyLiked) {
            article.likes = article.likes.filter(like =>
                !((userId && like.userId?.toString() === userId) ||
                (anonymousId && like.anonymousId === anonymousId))
            );
        } else {
            article.likes.push(userId ? { userId } : { anonymousId });
        }

        await article.save();

        return SUC(res, 200, {
            liked: !alreadyLiked,
            likesCount: article.likes.length
        }, alreadyLiked ? "Unliked the article" : "Liked the article");

    } catch (error) {
        console.error("Error processing like:", error);
        return ERR(res, 500, "Internal server error");
    }
};

const ShareArticle = async (req, res) => {
    const { articleId, userId, anonymousId } = req.body;

    try {
        if (!userId && !anonymousId) return ERR(res, 400, "User ID or Anonymous Id required");

        const article = await Article.findById(articleId);
        if (!article) return ERR(res, 404, "Article not found");

        const alreadyShared = article.shares.some(share => 
            (userId && share.userId.toString() === userId) ||
            (anonymousId && share.anonymousId === anonymousId)
        );

        if (alreadyShared) {
            article.shares = article.shares.filter(share => 
                !((userId && share.userId.toString() === userId) ||
                (anonymousId && share.anonymousId === anonymousId))
            );
        } else {
            article.shares.push(userId ? { userId } : { anonymousId });
        }

        await article.save();

        return SUC(res, 200, {
            shared: !alreadyShared,
            sharesCount: article.shares.length,
        }, alreadyShared ? "Unshared the article" : "Shared the article");

    } catch (error) {
        console.error("Error sharing article:", error);
        return ERR(res, 500, "Internal server error");
    }
};

module.exports = {
    AddArticle,
    GetArticle,
    GetArticleById,
    UpdateArticle,
    DeleteArticle,
    LikeArticle,
    ShareArticle,
}