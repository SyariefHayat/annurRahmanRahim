const { ERR } = require("../utils/response");

const isCoordinator = (req, res, next) => {
    if (!req.user || !['coordinator', 'product manager'].includes(req.user.role)) {
        return ERR(res, 403, "Akses hanya untuk coordinator atau product manager");
    }
    next();
};

module.exports = isCoordinator;