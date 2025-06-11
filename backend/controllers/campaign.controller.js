const { Campaign, Donor, User } = require("../models/index.model");
const { ERR, SUC } = require("../utils/response");
const cloudinary = require('../config/cloudinary');

const AddCampaign = async (req, res) => {
    const userId = req.user._id;
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

        // const user = await User.findById(userId);
        // if (!user) return ERR(res, 404, "User not found");

        // const notification = {
        //     title: "Campaign Berhasil Dibuat",
        //     message: `Campaign berjudul "${title}" telah berhasil dipublikasikan dan kini dapat dilihat oleh calon donatur. Anda dapat memantau perkembangan kampanye ini melalui dashboard Anda.`,
        //     type: "campaign"
        // };
        // user.notifications.unshift(notification);
        // await user.save();

        return SUC(res, 201, newCampaign, "Campaign created succesfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Campaign created failed");
    }
}

const GetCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const now = new Date();

        await Campaign.updateMany(
            { deadline: { $lt: now }, status: { $ne: "completed" } },
            { $set: { status: "completed" } }
        );

        const totalCampaigns = await Campaign.countDocuments();

        const campaigns = await Campaign.find()
            .populate("createdBy", "email provider profilePicture username role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!campaigns || campaigns.length === 0) {
            return ERR(res, 404, "Campaigns not found");
        }

        return SUC(res, 200, {
            data: campaigns,
            pagination: {
                total: totalCampaigns,
                page,
                limit,
                totalPages: Math.ceil(totalCampaigns / limit)
            }
        }, "Success getting campaigns");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting campaigns");
    }
};

const GetCampaignById = async (req, res) => {
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "Data not found");

        const campaign = await Campaign.findById(campaignId)
            .populate("createdBy", "provider username role email profilePicture");
        if (!campaign) return ERR(res, 404, "Campaign not found");
        
        const donors = await Donor.find({ 
            campaignId: campaignId,
            status: { $in: ['settlement', 'capture'] }
        }).populate("userId", "username profilePicture");
        
        return SUC(res, 200, { 
            campaign,
            donors
        }, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
}

const UpdateCampaign = async (req, res) => {
    const data = req.body;
    const userId = req.user._id;
    const campaignImgFile = req.file;
    const { campaignId } = req.params;

    try {
        if (!campaignId || !data) {
            return ERR(res, 400, "Missing required fields");
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        if (campaignImgFile) {
            if (campaign.image) {
                try {
                    await cloudinary.uploader.destroy(campaign.image);
                } catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error.message);
                }
            }
            campaign.image = campaignImgFile.filename;
        }

        campaign.category = data.category || campaign.category;
        campaign.title = data.title || campaign.title;
        campaign.description = data.description || campaign.description;
        campaign.targetAmount = data.targetAmount || campaign.targetAmount;
        campaign.deadline = data.deadline || campaign.deadline;

        await campaign.save();

        // const user = await User.findById(userId);
        // if (!user) return ERR(res, 404, "User not found");

        // const notification = {
        //     title: "Campaign Berhasil Diperbarui",
        //     message: `Campaign berjudul "${campaign.title}" telah berhasil diperbarui. Silakan tinjau kembali perubahan melalui dashboard Anda.`,
        //     type: "campaign"
        // };
        // user.notifications.unshift(notification);
        // await user.save();

        return SUC(res, 200, campaign, "Succes updating data");
    } catch (error) {
        console.error("Error updating campaign:", error);
        return ERR(res, 500, "Server error");
    }
};

const DeleteCampaign = async (req, res) => {
    const userId = req.user._id;
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "CampaignId is required");

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        const campaignTitle = campaign.title;

        if (campaign.image) {
            try {
                await cloudinary.uploader.destroy(campaign.image);
            } catch (error) {
                console.error(error);
            }
        };

        const relatedDonors = await Donor.find({ campaignId });
        if (relatedDonors.length > 0) {
            return ERR(res, 400, "Cannot delete campaign with existing transactions");
        };
        await Campaign.findByIdAndDelete(campaignId);

        // const user = await User.findById(userId);
        // if (!user) return ERR(res, 404, "Pengguna tidak ditemukan");

        // const notification = {
        //     title: "Campaign Dihapus",
        //     message: `Campaign berjudul "${campaignTitle}" telah berhasil dihapus dari sistem.`,
        //     type: "campaign"
        // };
        // user.notifications.unshift(notification);
        // await user.save();

        return SUC(res, 204, null, "Campaign removed successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error removing data");
    }
};

const GetCampaignDonors = async (req, res) => {
    const { campaignId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    try {
        if (!campaignId) return ERR(res, 400, "Campaign ID is required");

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        const skip = (page - 1) * limit;
        
        const totalDonors = await Transaction.countDocuments({ 
            campaignId, 
            status: { $in: ['settlement', 'capture'] }
        });
        
        const donors = await Transaction.find({ 
            campaignId, 
            status: { $in: ['settlement', 'capture'] } 
        })
        .populate("userId", "username profilePicture")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);
        
        return SUC(res, 200, {
            data: donors,
            pagination: {
                total: totalDonors,
                page,
                limit,
                totalPages: Math.ceil(totalDonors / limit)
            }
        }, "Success getting donors");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting donors");
    }
};

module.exports = {
    AddCampaign,
    GetCampaigns,
    GetCampaignById,
    UpdateCampaign,
    DeleteCampaign,
    GetCampaignDonors
}