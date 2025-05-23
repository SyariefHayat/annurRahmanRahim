const { User } = require("../models/index.model");
const { ERR, SUC } = require('../utils/response');

// Tambah notifikasi ke user
const AddNotification = async (req, res) => {
    const userId = req.user._id;
    const { title, message, type } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        const newNotification = { title, message, type };
        user.notifications.unshift(newNotification);
        await user.save();

        return SUC(res, 201, newNotification, "Notification added");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    }
};

// Ambil semua notifikasi
const GetNotifications = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findOne({ uid });
        if (!user) return ERR(res, 404, "User not found");

        return SUC(res, 200, user.notifications, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    }
};

// Hapus notifikasi berdasarkan index
const DeleteNotification = async (req, res) => {
    const userId = req.user._id;
    const { index } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        if (index < 0 || index >= user.notifications.length) {
            return ERR(res, 400, "Invalid notification index")
        };

        user.notifications.splice(index, 1);
        await user.save();

        return SUC(res, 204, null, "Notification deleted");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    }
};

const MarkNotificationAsRead = async (req, res) => {
    const userId = req.user._id;
    const { index } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        if (index < 0 || index >= user.notifications.length) {
            return ERR(res, 400, "Invalid notification index")
        };

        user.notifications[index].isRead = true;
        await user.save();

        return SUC(res, 200, user.notifications[index].isRead, "Notification marked as read")
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    }
};

module.exports = {
    AddNotification,
    GetNotifications,
    MarkNotificationAsRead,
    DeleteNotification,
}