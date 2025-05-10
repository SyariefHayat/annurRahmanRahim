const { ERR } = require("../utils/response");

const isAuthor = (req, res, next) => {
    if (!req.user || !['author', 'admin'].includes(req.user.role)) {
        return ERR(res, 403, "Akses hanya untuk author atau admin");
    }
    next();
};

module.exports = isAuthor;