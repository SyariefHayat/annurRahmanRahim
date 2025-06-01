const { admin } = require("../config/firebaseAdmin");
const { User, Article, Donor, Campaign, Program } = require("../models/index.model");
const { ERR, SUC } = require("../utils/response");

const GetDashboardSummary = async (req, res) => {
    try {
        const users = await User.find(); // Ambil semua user (dengan field notifikasi)
        
        const notifications = users.flatMap(user => 
            user.notifications?.map(notification => ({
                ...notification.toObject?.() || notification, // handle Mongoose Document
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                }
            }))
        );

        const [donors, articles, campaigns, programs] = await Promise.all([
            Donor.find().populate("userId", "provider profilePicture"),
            Article.find()
                .populate("createdBy", "username email role profilePicture provider")
                .populate("comments.user", "email username profilePicture provider")
                .sort({ createdAt: -1 }),
            Campaign.find()
                .populate("createdBy", "provider email username profilePicture")
                .sort({ createdAt: -1 }),
            Program.find(),
        ]);

        return SUC(res, 200, { users, donors, articles, campaigns, programs, notifications }, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const UpdateRoleUser = async (req, res) => {
    const { id, role } = req.body;

    try {
        if (!id || !role) {
            return ERR(res, 400, "ID and role are required");
        }

        const user = await User.findById(id);
        if (!user) {
            return ERR(res, 404, "User not found");
        }

        user.role = role;
        await user.save();

        return SUC(res, 200, user, "User role updated successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    }
}

const DeleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found")

        // Hapus dari Firebase
        await admin.auth().deleteUser(user.uid);

        if (user.provider !== "google") {
            if (user.profilePicture) {
                try {
                    await cloudinary.uploader.destroy(user.profilePicture);
                } catch (error) {
                    console.error(error);
                }
            };

            if (user.profileAlbum) {
                try {
                    await cloudinary.uploader.destroy(user.profileAlbum);
                } catch (error) {
                    console.error(error);
                }
            };
        }

        // Hapus dari MongoDB
        await User.findByIdAndDelete(userId);
        // await Article.deleteMany({ createdBy: userId });
        // await Donation.deleteMany({ createdBy: userId });
        // await Donor.deleteMany({ email: user.email });

        return SUC(res, 204, null, "User successfully deleted from Firebase and MongoDB");
    } catch (error) {
        console.error("Error deleting user:", error);
        return ERR(res, 500, "Remove error: " + error.message);
    }
};

const DeleteDonor = async (req, res) => {
    const { donorId } = req.params;

    try {
        if (!donorId) return ERR(res, 400, "donorId is required");

        const donor = await Donor.findOneAndDelete({ donorId });
        if (!donor) return ERR(res, 404, "Donor not found");
        
        return SUC(res, 204, null, "Donor deleted successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Failed to deleting transaction");
    }
};

module.exports = {
    GetDashboardSummary,
    UpdateRoleUser,
    DeleteUser,
    DeleteDonor,
}