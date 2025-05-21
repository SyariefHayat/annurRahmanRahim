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

        // Find the transaction
        const donor = await Donor.findOne({ donorId: order_id });
        if (!donor) return ERR(res, 404, "Donor not found");

        // Cek jika transaksi sukses (settlement atau capture)
        if (transaction_status === 'settlement' || transaction_status === 'capture') {
            // Update transaksi dengan status berhasil
            donor.paymentType = payment_type;
            donor.status = transaction_status;
            
            if (va_numbers) donor.vaNumbers = va_numbers;
            if (issuer) donor.issuer = issuer;

            await donor.save();

            // Pastikan nominal sesuai
            if (parseFloat(gross_amount) === donor.amount) {
                const campaign = await Campaign.findById(donor.campaignId);
                if (!campaign) return ERR(res, 404, "Campaign not found");

                // Update campaign amounts and donor count
                campaign.collectedAmount += donor.amount;
                campaign.donorCount += 1;

                if (campaign.collectedAmount >= campaign.targetAmount) {
                    campaign.status = 'Completed';
                }
                
                await campaign.save();
            }

        } else {
            // Untuk status lain (expire, deny, cancel, dll), update status transaksi
            donor.status = transaction_status;
            await donor.save();
            
            return SUC(res, 200, { donorId: order_id }, `Donor status updated to ${transaction_status}`);
        }

        return SUC(res, 200, null, "Donor created successfully");
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

const GetDonorByCampaignId = async (req, res) => {
    const { campaignId } = req.params;

    try {
        if (!campaignId) return ERR(res, 400, "Campaign id is required");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;
        
        const totalDonors = await Donor.countDocuments();

        const donor = await Donor.find({ campaignId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!donor) return ERR(res, 404, "Donor not found");

        return SUC(res, 200, {
            data: donor,
            pagination: {
                total: totalDonors,
                page,
                limit,
                totalPages: Math.ceil(totalDonors / limit)
            }
        }, "Success getting donor");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
};

const GetDonorByDonorId = async (req, res) => {
    const { orderId } = req.params;

    try {
        if (!orderId) return ERR(res, 400, "Order id is required");

        const donor = await Donor.findOne({ donorId: orderId })
            .populate("userId", "username profilePicture email")
            .populate("campaignId", "title image");
            
        if (!donor) return ERR(res, 404, "Transaction not found");

        return SUC(res, 200, donor, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
};

const DeleteDonor = async (req, res) => {
    const { orderId } = req.params;

    try {
        if (!orderId) return ERR(res, 400, "orderId is required");

        const transaction = await Transaction.findOneAndDelete({ orderId });
        if (!transaction) return ERR(res, 404, "Transaction not found");
        
        return SUC(res, 200, transaction, "Transaction deleted successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Failed to deleting transaction");
    }
};

const AmenTransaction = async (req, res) => {
    const { transactionId, userId, anonymousId } = req.body;

    try {
        if (!transactionId) return ERR(res, 400, "Transaction ID is required");
        if (!userId && !anonymousId) return ERR(res, 400, "User ID or anonymous ID required");

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return ERR(res, 404, "Transaction not found");

        const alreadyAmen = transaction.amens.some(amen =>
            (userId && amen.userId?.toString() === userId) ||
            (anonymousId && amen.anonymousId === anonymousId)
        );

        if (alreadyAmen) {
            transaction.amens = transaction.amens.filter(amen =>
                !((userId && amen.userId?.toString() === userId) ||
                (anonymousId && amen.anonymousId === anonymousId))
            );
        } else {
            transaction.amens.push(userId ? { userId } : { anonymousId });
        }

        await transaction.save();

        return SUC(res, 200, {
                amen: !alreadyAmen,
                amensCount: transaction.amens.length
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
    GetDonorByDonorId,
    DeleteDonor,
    AmenTransaction
}