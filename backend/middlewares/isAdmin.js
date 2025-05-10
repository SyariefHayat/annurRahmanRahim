const { ERR } = require("../utils/response");

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return ERR(res, 403, "Akses admin diperlukan");
    }
    next();
};

module.exports = isAdmin;