require("dotenv").config();
const { User } = require("../models/index.model");
const { SUC, ERR } = require("../utils/response");

const SignUpUser = async (req, res) => {
    const { uid, email, username, provider, profilePicture } = req.body;

    try {
        if (!uid || !email || !username) return ERR(res, 400, 'Uid, email, and username id required');

        const existingUser = await User.findOne({
            $or: [
                { uid },
                { email },
            ]
        });
        if (existingUser) return ERR(res, 409, 'User sudah terdaftar');

        const existingName = await User.findOne({ username });
        if (existingName) return ERR(res, 409, 'Username sudah di gunakan');

        const userData = {
            uid,
            username,
            email,
            provider,
            profilePicture,
            // activityHistory: [{
            //     action: 'signup',
            //     description: 'User registered via Firebase',
            //     timestamp: new Date()
            // }],
        };

        const user = await User.create(userData);

        return SUC(res, 201, user, 'User created successfully')
    } catch (error) {
        console.error(error);
        return ERR(res, 500, 'Signup failed');
    }
}

const SignInUser = async (req, res) => {
    const { uid, email } = req.body;

    try {
        if(!uid || !email) return ERR(res, 400, "uid and email is required");

        const user = await User.findOne({ 
            $or: [
                { uid },
                { email },
            ]
        });
        if (!user) return ERR(res, 404, 'User tidak terdaftar');

        // user.activityHistory.push({
        //     action: "Login",
        //     description: "User logged in",
        // });
        await user.save();
        
        return SUC(res, 200, user, 'Login succesfully');
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error signing in token")
    }
}

const SignOutUser = async (req, res) => {
    const id = req.user._id;

    try {
        if (!id) return ERR(res, 400, "User id is required");

        const user = await User.findById(id);
        if (!user) return ERR(res, 404, "User not found");

        // const activity = user.activityHistory.push({
        //     action,
        //     description,
        // });
        // await user.save();

        return SUC(res, 200, user, "Activity Recorded");
    } catch (error) {
        console.error("Activity logging error: ", error);
        return ERR(res, 500, "Activity logging error")
    }
}

const ForgotPasswordUser = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) return ERR(res, 400, "Email is required");

        const user = await User.findOne({ email });
        if (!user) return ERR(res, 404, "User not found");

        // user.activityHistory.push({
        //     action: "Reset Password",
        //     description: "User requested password reset",
        // });

        await user.save();

        return SUC(res, 200, null, "Reset password request received");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Something went wrong");
    }
}

module.exports = {
    SignUpUser, 
    SignInUser,
    SignOutUser,
    ForgotPasswordUser,
}