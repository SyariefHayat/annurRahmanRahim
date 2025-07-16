const { Campaign } = require("../models/index.model");

const checkCampaignAccess = async (req, res, next) => {
    const userId = req.user._id;
    const role = req.user.role;
    const { campaignId } = req.params;

    if (!campaignId) return res.status(400).json({ message: "Campaign ID is required" });

    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        const allowedRoles = ["developer", "project manager"];

        // Developer & PM punya akses penuh
        if (allowedRoles.includes(role)) {
            req.campaign = campaign;
            return next();
        }

        // fundraiser hanya jika dia pemilik campaign
        if (role === "fundraiser" && campaign.createdBy.toString() === userId.toString()) {
            req.campaign = campaign;
            return next();
        }

        // Role lain ditolak
        return res.status(403).json({ message: "Anda tidak berhak mengakses campaign ini" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error checking campaign access" });
    }
};

module.exports = checkCampaignAccess;