const { ERR, SUC } = require("../utils/response");
const { admin } = require("../config/firebaseAdmin");
const { getRoleLevel } = require("../utils/getRoleLevel");
const { User, Article, Donor, Campaign, Program } = require("../models/index.model");

const GetDashboardSummary = async (req, res) => {
    try {
        const users = await User.find();
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

        return SUC(res, 200, { users, donors, articles, campaigns, programs }, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const UpdateRoleUser = async (req, res) => {
    const { id, role } = req.body;
    const currentUser = req.user;

    try {
        if (!id || !role) return ERR(res, 400, "ID dan role wajib diisi");

        const user = await User.findById(id);
        if (!user) return ERR(res, 404, "User tidak ditemukan");

        const currentUserLevel = getRoleLevel(currentUser.role);
        const targetUserLevel = getRoleLevel(user.role);
        const newRoleLevel = getRoleLevel(role);

        if (currentUserLevel <= targetUserLevel) return ERR(res, 403, "Anda tidak berhak mengubah role user ini");

        if (newRoleLevel >= currentUserLevel) return ERR(res, 403, "Anda hanya bisa memberikan role yang lebih rendah dari Anda");

        if (currentUser.role !== 'developer') {
            if (currentUserLevel - newRoleLevel !== 1) return ERR(res, 403, "Role baru harus tepat satu tingkat di bawah Anda");
        }

        user.role = role;
        await user.save();

        return SUC(res, 200, user, "Role user berhasil diperbarui");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Terjadi kesalahan server");
    }
};

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