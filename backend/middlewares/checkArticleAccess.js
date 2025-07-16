const { Article } = require("../models/index.model");

const checkArticleAccess = async (req, res, next) => {
    const userId = req.user._id;
    const role = req.user.role;
    const articleId = req.params.id;

    if (!articleId) return res.status(400).json({ message: "Article Id is required" });

    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: "Campaign not found" });

        const allowedRoles = ["developer", "project manager"];

        if (allowedRoles.includes(role)) {
            req.article = article;
            return next();
        }

        if (role === "fundraiser" && article.createdBy.toString() === userId.toString()) {
            req.article = article;
            return next();
        }

        return res.status(403).json({ message: "Anda tidak berhak mengakses campaign ini" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error checking campaign access" });
    }
};

module.exports = checkArticleAccess;