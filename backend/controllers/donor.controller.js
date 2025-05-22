require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const snap = require('../config/midtrans');
const { ERR, SUC } = require('../utils/response');

const { BASE_URL_VERCEL } = process.env;

const { 
    Campaign, 
    Donor, 
    User
} = require('../models/index.model');

const MidtransTransaction = async (req, res) => {
    const { campaignId, email, name, message, amount, isAnonymous, userId } = req.body;

    try {
        if (!campaignId || !email || !name || !amount) return ERR(res, 400, "Email, name and amount are required");

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return ERR(res, 404, "Campaign not found");

        const donorId = `CAMPAIGN-${uuidv4()}`;

        const transactionDetails = {
            transaction_details: {
                order_id: donorId,
                gross_amount: amount,
            },
            customer_details: { email },
            callbacks: {
                finish: `${BASE_URL_VERCEL}campaign/receipt`,
                error: `${BASE_URL_VERCEL}campaign/receipt`,
                unfinish: `${BASE_URL_VERCEL}campaign/receipt`,
            },
        };

        const transaction = await snap.createTransaction(transactionDetails);

        const newTransaction = await Donor.create({
            userId,
            campaignId,
            email,
            name,
            message,
            isAnonymous,
            amount,
            donorId,
            transactionToken: transaction.token,
        });

        const responseData = {
            transaction,
            donorId: newTransaction.donorId,
        };

        return SUC(res, 201, responseData, "Transaction created successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Create transaction failed");
    }
}

const MidtransWebHook = async (req, res) => {
    const { order_id, transaction_status, payment_type, va_numbers, gross_amount, issuer } = req.body;

    try {
        if (!order_id || !transaction_status) return ERR(res, 400, "Missing order_id or status");

        const donor = await Donor.findOne({ donorId: order_id });
        if (!donor) return ERR(res, 404, "Donor not found");

        if (donor.status === 'settlement' || donor.status === 'capture') {
            return SUC(res, 200, { donorId: order_id }, "Payment already processed");
        }

        const previousStatus = donor.status;
        donor.paymentType = payment_type;
        donor.status = transaction_status;
        
        if (va_numbers) donor.vaNumbers = va_numbers;
        if (issuer) donor.issuer = issuer;

        await donor.save();

        if ((transaction_status === 'settlement' || transaction_status === 'capture') && 
            (previousStatus !== 'settlement' && previousStatus !== 'capture')) {
            
            if (parseFloat(gross_amount) === donor.amount) {
                const campaign = await Campaign.findById(donor.campaignId);
                if (!campaign) return ERR(res, 404, "Campaign not found");

                campaign.collectedAmount += donor.amount;
                campaign.donorCount += 1;

                if (campaign.collectedAmount >= campaign.targetAmount) {
                    campaign.status = 'Completed';
                }
                
                await campaign.save();
            };
            
            return SUC(res, 200, { donorId: order_id }, "Payment processed successfully");
        } else {
            return SUC(res, 200, { donorId: order_id }, `Donor status updated to ${transaction_status}`);
        };
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Webhook error");
    }
};

const GetAllDonors = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        // if (user.role !== "admin") return ERR(res, 400, "Role terlalu rendah");

        const allDonors = await Donor.find()
            .populate("userId", "provider profilePicture")
            .populate("campaignId", "title image");
        
        return SUC(res, 200, allDonors, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const GetDonorByDonorId = async (req, res) => {
    const { donorId } = req.params;

    try {
        if (!donorId) return ERR(res, 400, "Order id is required");

        const donor = await Donor.findOne({ donorId })
            .populate("userId", "username profilePicture email")
            .populate("campaignId", "title image");
            
        if (!donor) return ERR(res, 404, "Transaction not found");

        return SUC(res, 200, donor, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
}

const GetDonorByCampaignId = async (req, res) => {
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "Campaign id is required");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;
        
        const totalDonors = await Donor.find({ campaignId });

        const donors = await Donor.find({ campaignId })
            .populate("userId", "provider profilePicture")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        if (!donors) return ERR(res, 404, "Donor not found");

        return SUC(res, 200, {
            donor: donors,
            pagination: {
                total: totalDonors,
                page,
                limit,
                totalData: totalDonors.length,
                totalPages: Math.ceil(totalDonors.length / limit)
            }
        }, "Success getting donor");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
};

const GetDonorMessages = async (req, res) => {
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "Campaign id is required");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        const skip = (page - 1) * limit;
        
        const totalDonorMessages = await Donor.find({
            campaignId,
            message: { $exists: true, $ne: "" }
        });

        const donorMessages = await Donor.find({ 
            campaignId,
            message: { $exists: true, $ne: "" } 
        })
        .populate("userId", "provider profilePicture")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

        if (donorMessages.length === 0) return ERR(res, 404, "Donor message not found");

        return SUC(res, 200, {
            message: donorMessages,
            pagination: {
                total: totalDonorMessages,
                page,
                limit,
                totalData: totalDonorMessages.length,
                totalPages: Math.ceil(totalDonorMessages.length / limit)
            }
        }, "Success getting donor with message");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
};

const AmenMessage = async (req, res) => {
    const { donorId, userId, anonymousId } = req.body;

    try {
        if (!donorId) return ERR(res, 400, "Transaction ID is required");
        if (!userId && !anonymousId) return ERR(res, 400, "User ID or anonymous ID required");

        const donor = await Donor.findById(donorId);
        if (!donor) return ERR(res, 404, "Transaction not found");

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
        }

        await donor.save();

        return SUC(res, 200, {
                amen: !alreadyAmen,
                amensCount: donor.amens.length
            }, alreadyAmen ? "Amen removed" : "Amen given"
        );

    } catch (error) {
        console.error("Error processing amen:", error);
        return ERR(res, 500, "Internal server error");
    }
};

module.exports = {
    MidtransTransaction,
    MidtransWebHook,
    GetAllDonors,
    GetDonorByCampaignId,
    GetDonorMessages,
    GetDonorByDonorId,
    AmenMessage,
}