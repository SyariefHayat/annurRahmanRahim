const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["campaign", "article", "like", "comment", "system"], default: "system" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    profileAlbum: { type: String, default: "" },
    provider: { type: String, enum: ['google', 'email'], default: 'email' },
    role: { type: String, enum: ['user', 'fundraiser', 'project curator', 'product manager', 'developer'], default: 'user' },

    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    socialMedia: {
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        facebook: { type: String, default: "" }
    },

    notifications: [NotificationSchema],
    preferences: {
        isPrivate: { type: Boolean, default: true },
        notificationTypes: {
            email: { type: Boolean, default: true },
            donationUpdates: { type: Boolean, default: true },
            articleLikes: { type: Boolean, default: true },
            articleComments: { type: Boolean, default: true },
            systemUpdates: { type: Boolean, default: true }
        }
    }
}, { timestamps: true });

const CampaignSchema = mongoose.Schema({
    image: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    story: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetAmount: { type: Number, required: true },
    collectedAmount: { type: Number, default: 0 },
    donorCount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ["Ongoing", "Completed", "Cancelled"],
        default: "Ongoing"
    }
}, { timestamps: true });

const DonorSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    email: { type: String, required: true },
    name: { type: String, default: "Orang baik" },
    message: { type: String },
    isAnonymous: { type: Boolean, default: false },
    amount: { type: Number, required: true, min: 0 },
    donorId: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },

    transactionToken: { type: String },
    paymentType: { type: String },
    vaNumbers: {
        va_number: {
            type: String
        },
        bank: {
            type: String
        }
    },
    issuer: { type: String },
    status: {
        type: String,
        enum: [
            'pending',
            'settlement',
            'capture',
            'deny',
            'cancel',
            'expire',
            'refund'
        ],
        default: 'pending'
    },

    amens: [
        new mongoose.Schema(
            {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            anonymousId: { type: String },
            createdAt: { type: Date, default: Date.now }
            },
            { _id: false }
        )
    ]
});

const LikeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    anonymousId: { type: String },
    likedAt: { type: Date, default: Date.now },
});

const ShareSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    anonymousId: { type: String },
    shareAt: { type: Date, default: Date.now },
});

const ReplySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    commentAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: [ReplySchema],
    commentAt: { type: Date, default: Date.now }
});

const ArticleSchema = mongoose.Schema({
    cover: { type: String, required: true },
    title: { type: String, required: true },
    content: [{
        type: {
            type: String,
            enum: ["heading-1", "heading-2", "heading-3", "text", "image"],
            required: true,
        },
        value: {
            type: String,
            required: true,
        }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String, trim: true, maxlength: 20 }],
    likes: [LikeSchema],
    shares: [ShareSchema],
    comments: [CommentSchema],
}, { timestamps: true });

const ProgramSchema = mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    proposer: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Menunggu Persetujuan", "Disetujui", "Ditolak"],
        default: "Menunggu Persetujuan",
    },
    budget: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    document: { type: String, required: true },
    summary: [{
        background: { type: String, required: true },
        objectives: [String],
    }],
    timeline: [{
        date: { type: Date, required: true },
        title: { type: String, required: true },
        activities: [String]
    }],
    budgetBreakdown: [{
        item: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
    }],
    supportExpected: [String],
}, { timestamps: true });

module.exports = {
    User: mongoose.model("User", UserSchema),
    Campaign: mongoose.model("Donation", CampaignSchema),
    Donor: mongoose.model("Donor", DonorSchema),
    Article: mongoose.model("Article", ArticleSchema),
    Program: mongoose.model("Program", ProgramSchema),
}