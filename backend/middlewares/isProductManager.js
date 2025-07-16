const { ERR } = require("../utils/response");

const isProductManager = (req, res, next) => {
    if (!req.user || !['developer', 'project manager'].includes(req.user.role)) {
        return ERR(res, 403, "Akses lebih tinggi diperlukan");
    }
    next();
};

module.exports = isProductManager;