const { ERR } = require("../utils/response");

const isProjectCurator = (req, res, next) => {
    if (!req.user || !['project curator', 'project manager', 'developer'].includes(req.user.role)) {
        return ERR(res, 403, "Akses hanya untuk project curator atau project manager");
    }
    next();
};

module.exports = isProjectCurator;