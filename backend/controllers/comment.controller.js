const { Article, User } = require("../models/index.model");
const { ERR, SUC } = require("../utils/response");

const AddComment = async (req, res) => {
    const { text, articleId } = req.body;
    const userId = req.user.id;

    try {
        if (!text || text.trim() === "" || !articleId || !userId) return ERR(res, 400, "Comment text, articleId, userId is required");

        const article = await Article.findById(articleId);
        if (!article) return ERR(res, 404, "Article not found");

        const newComment = {
            user: userId,
            text,
            likes: 0,
            dislikes: 0,
            replies: [],
        }

        article.comments.push(newComment);
        await article.save();

        const articleOwner = await User.findById(article.createdBy);
        articleOwner.notifications.unshift({
            title: "Komentar Baru",
            message: `Artikel Anda mendapat komentar baru: "${text.slice(0, 50)}..."`,
            type: "comment"
        });
        await articleOwner.save();

        const populatedArticle = await Article.findById(articleId)
            .populate("comments.user", "username profilePicture");

        const addedComment = populatedArticle.comments[populatedArticle.comments.length - 1];

        return SUC(res, 201, addedComment, "Comment added successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error adding comment");
    }
}

const getComment = async (req, res) => {
    const articleId = req.params.id;

    try {
        const article = await Article.findById(articleId)
            .populate("comments.user", "username profilePicture provider")
            .populate("comments.replies.user", "username profilePicture provider");

        if (!article) return ERR(res, 404, "Article not found");

        return SUC(res, 200, article.comments, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
}

const AddReply = async (req, res) => {
    const { text, articleId, commentId } = req.body;
    const userId = req.user.id;

    try {
        if (!text || text.trim() === "" || !articleId || !userId || !commentId) return ERR(res, 400, "comment text, articleId, userId, commentId is required");

        const article = await Article.findById(articleId);
        if (!article) return ERR(res, 404, "Article not found");

        const comment = await article.comments.id(commentId);
        if (!comment) return ERR(res, 404, "Comment not found");

        const newReply = {
            user: userId,
            text,
            likes: 0,
            dislikes: 0,
            commentAt: new Date()
        };

        comment.replies.push(newReply);
        await article.save();

        const commentOwner = await User.findById(comment.user);
        commentOwner.notifications.unshift({
            title: "Balasan Baru",
            message: `Komentar Anda mendapat balasan: "${text.slice(0, 50)}..."`,
            type: "comment"
        });
        await commentOwner.save();

        const populatedArticle = await Article.findById(articleId)
            .populate("comments.user", "username profilePicture")
            .populate("comments.replies.user", "username profilePicture");

        const updatedComment = populatedArticle.comments.id(commentId);

        return SUC(res, 201, updatedComment, "Reply added successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error adding reply");
    }
}

const DeleteComment = async (req, res) => {
    const commentId = req.params.id;

    try {
        if (!commentId) return ERR(res, 400, "Comment id is required");

        const article = await Article.findOne({ "comments._id": commentId });
        if (!article) return ERR(res, 404, "Comment not found in any article");

        const comment = article.comments.id(commentId);
        if (!comment) return ERR(res, 404, "Comment not found");

        article.comments = article.comments.filter(
            c => c._id.toString() !== commentId
        );
        await article.save();

        const commentOwner = await User.findById(comment.user);
        commentOwner.notifications.unshift({
            title: "Komentar Dihapus",
            message: `Komentar Anda pada artikel "${article.title}" telah dihapus.`,
            type: "comment"
        });
        await commentOwner.save();

        return SUC(res, 200, null, "Success deleting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to deleting data");
    }
}

module.exports = {
    AddComment,
    getComment,
    AddReply,
    DeleteComment,
}