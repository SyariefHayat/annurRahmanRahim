const { SUC, ERR } = require("../utils/response");
const cloudinary = require('../config/cloudinary');
const { User, Transaction, Article } = require("../models/index.model");

const GetAllUser = async (req, res) => {
    const userId = req.user._id;
    
    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        const allUser = await User.find();
        return SUC(res, 200, allUser, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const GetMe = async (req, res) => {
    const userId = req.params.id;

    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user= await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        return SUC(res, 200, user, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const GetTransactionByUserId = async (req, res) => {
    const { id } = req.user;

    try {
        if (!id) return res.status(400).json({ success: false, message: "User id is required" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const transactions = await Transaction.find({ email: user.email })
            .populate({
                path: 'campaignId',
                select: 'title description category collectedAmount targetAmount deadline createdBy',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    select: 'username email profilePicture'
                }
            })
            .sort({ date: -1 });

        return SUC(res, 200, transactions, "Success getting data")
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const GetArticleByUserId = async (req, res) => {
    const { id } = req.user;

    try {
        if (!id) return ERR(res, 400, "User id is required");

        const user = await User.findById(id);
        if (!user) return ERR(res, 404, "User not found");

        const articles = await Article.find({ createdBy: id }).sort({ createdAt: -1 });
        
        return SUC(res, 200, articles, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const UpdateUser = async (req, res) => {
    const userId = req.user?.id;
    const data = { ...req.body };

    try {
        if (!userId) return ERR(res, 400, "User ID not found");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        const profilePictureFile = req.files?.["profilePicture"]?.[0];
        const profileAlbumFile = req.files?.["profileAlbum"]?.[0];

        if (profilePictureFile && profilePictureFile.filename !== user.profilePicture) {
            if (user.profilePicture) {
                await cloudinary.uploader.destroy(user.profilePicture);
            }
            data.profilePicture = profilePictureFile.filename;
        };

        if (profileAlbumFile && profileAlbumFile.filename !== user.profileAlbum) {
            if (user.profileAlbum) {
                await cloudinary.uploader.destroy(user.profileAlbum);
            }
            data.profileAlbum = profileAlbumFile.filename;
        };

        if (!Object.keys(data).length) {
            return ERR(res, 400, "No data to update");
        };

        if (data.id === user._id) {
            const updatedUser = await User.findByIdAndUpdate(userId, data, {
                new: true,
                runValidators: true,
            });
            return SUC(res, 200, updatedUser, "Successfully updated user data");
        };

        const updatedUser = await User.findByIdAndUpdate(data.id, data, {
            new: true,
            runValidators: true,
        });
        
        return SUC(res, 200, updatedUser, "Successfully updated user data");
    } catch (error) {
        console.error("UpdateUser Error:", error);
        return ERR(res, 500, "Internal server error");
    }
};

const DeleteProfileAlbum = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        if (!user.profileAlbum) ERR(res, 400, "No profile album to delete");

        await cloudinary.uploader.destroy(user.profileAlbum);

        user.profileAlbum = null;
        await user.save();

        return SUC(res, 200, user, "Profile album deleted successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to deleting album");
    }
}

const DeleteProfilePicture = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        if (!user.profilePicture) ERR(res, 400, "No profile album to delete");

        await cloudinary.uploader.destroy(user.profilePicture);

        user.profilePicture = null;
        await user.save();

        return SUC(res, 200, user, "Profile album deleted successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to deleting album");
    }
}

module.exports = {
    GetAllUser,
    GetMe,
    GetTransactionByUserId,
    GetArticleByUserId,
    UpdateUser,
    DeleteProfileAlbum,
    DeleteProfilePicture,
}