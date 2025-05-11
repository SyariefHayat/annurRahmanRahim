const { Campaign, User } = require("../models/index.model");
const { ERR, SUC } = require("../utils/response");
const cloudinary = require('../config/cloudinary');

const AddCampaign = async (req, res) => {
    const campaignImgFile = req.file;
    const campaignImage = campaignImgFile ? `${campaignImgFile.filename}` : null;

    const { title, category, description, createdBy, targetAmount, deadline } = req.body;

    try {
        if (!title || !category || !description || !targetAmount || !createdBy) return ERR(res, 400, "All fields are required");

        const newCampaign = new Campaign({
            image: campaignImage,
            category,
            title,
            description,
            createdBy,
            targetAmount,
            deadline,
        });
        await newCampaign.save();

        return SUC(res, 201, newCampaign, "Campaign created succesfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Campaign created failed");
    }
}

const GetCampaign = async (req, res) => {
    try {
        const donations = await Campaign.find()
            .populate("createdBy donors.userId")
            .sort({ createdAt: -1 });

        return SUC(res, 200, donations, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
};

const GetCampaignById = async (req, res) => {
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "Data not found");

        const campaign = await Campaign.findById(campaignId).populate("createdBy donors.userId");
        if (!campaign) return ERR(res, 404, "Campaign not found");
        
        return SUC(res, 200, campaign, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
}

const UpdateCampaign = async (req, res) => {
    const data = req.body;
    const { campaignId } = req.params;
    const campaignImgFile = req.file;

    try {
        if (!campaignId || !data) {
            return ERR(res, 400, "Missing required fields");
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        // Handle image update
        if (campaignImgFile) {
            // Hapus gambar lama dari cloudinary jika ada
            if (campaign.image) {
                try {
                    await cloudinary.uploader.destroy(campaign.image);
                } catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error.message);
                }
            }
            campaign.image = campaignImgFile.filename;
        }

        // Update field lainnya dari body
        campaign.category = data.category || campaign.category;
        campaign.title = data.title || campaign.title;
        campaign.description = data.description || campaign.description;
        campaign.targetAmount = data.targetAmount || campaign.targetAmount;
        campaign.deadline = data.deadline || campaign.deadline;

        await campaign.save();

        return SUC(res, 200, campaign, "Succes updating data");
    } catch (error) {
        console.error("Error updating campaign campaign:", error);
        return ERR(res, 500, "Server error");
    }
};

const DeleteCampaign = async (req, res) => {
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "CampaignId is required");

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        if (campaign.image) {
            try {
                await cloudinary.uploader.destroy(campaign.image);
            } catch (error) {
                console.error(error);
            }
        };

        await Campaign.findByIdAndDelete(campaignId);
        return SUC(res, 204, null, "Campaign removed successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to removing data");
    }
};

const AmenCampaign = async (req, res) => {
    const { campaignId, donorId, userId, anonymousId } = req.body;

    try {
        if (!userId && !anonymousId) return ERR(res, 400, "User ID or anonymous ID required");

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        const donor = campaign.donors.id(donorId);
        if (!donor) return ERR(res, 404, "Donor not found");

        const alreadyAmen = donor.amens.some(amen =>
            (userId && amen.userId?.toString() === userId) ||
            (anonymousId && amen.anonymousId === anonymousId)
        );

        if (alreadyAmen) {
            donor.amens = donor.amens.filter(amen =>
                !((userId && amen.userId?.toString() === userId) ||
                (anonymousId && amen.anonymousId === anonymousId))
            );
        } else {
            donor.amens.push(userId ? { userId } : { anonymousId });
        };

        await campaign.save();

        return SUC(res, 200, {
                amen: !alreadyAmen,
                amensCount: donor.amens.length
            }, alreadyAmen ? "Amen removed" : "Amen given"
        );

    } catch (error) {
        console.error("Error processing amen:", error);
        return ERR(res, 500, "Internal server error");
    };
};

module.exports = {
    AddCampaign,
    GetCampaign,
    GetCampaignById,
    UpdateCampaign,
    DeleteCampaign,
    AmenCampaign,
}