const { Program } = require("../models/index.model");

const checkProgramAccess = async (req, res, next) => {
    const userId = req.user._id;
    const role = req.user.role;
    const { programId } = req.params;

    if (!programId) return res.status(400).json({ message: "Program Id is required" });

    try {
        const program = await Program.findById(programId);
        if (!program) return res.status(404).json({ message: "Campaign not found" });

        const allowedRoles = ["developer", "project manager"];

        if (allowedRoles.includes(role)) {
            req.program = program;
            return next();
        }

        if (role === "project curator" && program.createdBy.toString() === userId.toString()) {
            req.program = program;
            return next();
        }

        return res.status(403).json({ message: "Anda tidak berhak mengakses bisnis ini" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error checking bisnis access" });
    }
};

module.exports = checkProgramAccess;