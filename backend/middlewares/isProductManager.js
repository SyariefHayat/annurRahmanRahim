const { ERR } = require("../utils/response");

const isProductManager = (req, res, next) => {
    if (!req.user || req.user.role === 'user') {
        return ERR(res, 403, "Akses lebih tinggi diperlukan");
    }
    next();
};

module.exports = isProductManager;