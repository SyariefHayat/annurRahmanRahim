const { ERR } = require("../utils/response");
const { User } = require("../models/index.model");
const { admin } = require("../config/firebaseAdmin");


const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return ERR(res, 401, "Tidak diizinkan mengakses route ini");

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken.uid) return ERR(res, 401, "Token tidak valid");

        const user = await User.findOne({ uid: decodedToken.uid });
        if (!user) return ERR(res, 404, "User tidak di temukan");

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifikasi token:', error);
        return ERR(res, 401, "Tidak diizinkan mengakses route ini");
    }
};

module.exports = verifyToken;