require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const snap = require('../config/midtrans');
const { ERR, SUC } = require('../utils/response');

const { BASE_URL_VERCEL } = process.env;

const { 
    Campaign, 
    Transaction, 
    User
} = require('../models/index.model');

const MidtransTransaction = async (req, res) => {
    const { campaignId, email, name, message, amount, isAnonymous } = req.body;

    try {
        if ( !campaignId, !email, !name, !amount) return ERR(res, 400, "Email and amount is required");

        const donation = await Campaign.findById(campaignId);
        if (!donation) return ERR(res, 404, "donation not found");

        const orderId = `CAMPAIGN-${uuidv4()}`;

        const transactionDetails = {
            transaction_details: {
                order_id: orderId,
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

        const newTransaction = await Transaction.create({
            campaignId,
            email,
            name,
            message,
            isAnonymous,
            amount,
            orderId,
            transactionToken: transaction.token,
        });

        const responseData = {
            transaction,
            orderId: newTransaction.orderId,
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

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { orderId: order_id },
            {
                paymentType: payment_type,
                status: transaction_status,
                ...(va_numbers && { vaNumbers: va_numbers }),
                ...(issuer && { issuer }),
            },
            { new: true }
        );

        if (!updatedTransaction) return ERR(res, 404, "Transaction not found");

        // Jika transaksi sukses dan nominal sesuai
        if ((transaction_status === 'settlement' || transaction_status === 'capture') &&
            parseFloat(gross_amount) === updatedTransaction.amount
        ) {
            const campaign = await Campaign.findById(updatedTransaction.donationId);
            if (!campaign) return ERR(res, 404, "Donation not found");

            // Tambahkan donor
            const user = await User.findOne({ email: updatedTransaction.email }); // optional
            campaign.donors.push({
                userId: user?._id || null,
                name: updatedTransaction.isAnonymous ? "Orang baik" : updatedTransaction.name,
                amount: updatedTransaction.amount,
                message: updatedTransaction.message,
                donatedAt: updatedTransaction.date,
            });

            // Tambah collectedAmount
            campaign.collectedAmount += updatedTransaction.amount;
            await campaign.save();
        }

        return SUC(res, 200, updatedTransaction, "Transaction updated successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Webhook error");
    }
};

const GetAllTransaction = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) return ERR(res, 400, "User id is required");

        const user = await User.findById(userId);
        if (!user) return ERR(res, 404, "User not found");

        // if (user.role !== "admin") return ERR(res, 400, "Role terlalu rendah");

        const allTransaction = await Transaction.find().populate({
            path: 'donationId',
            populate: {
                path: 'donors.userId',
                select: 'profilePicture'
            }
        });
        return SUC(res, 200, allTransaction, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error to getting data");
    }
}

const GetTransactionByOrderId = async (req, res) => {
    const { orderId } = req.params;

    try {
        if (!orderId) return ERR(res, 400, "Order id is required");

        const transaction = await Transaction.findOne({ orderId });
        if (!transaction) return ERR(res, 404, "Transaction not found");

        return SUC(res, 200, transaction, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
};

const DeleteTransaction = async (req, res) => {
    const { orderId } = req.params;

    try {
        if (!orderId) return ERR(res, 400, "orderId is required");

        const transaction = await Transaction.findOneAndDelete({ orderId });
        return SUC(res, 200, transaction, "Transaction deleted successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Failed to deleting transaction");
    }
};

module.exports = {
    MidtransTransaction,
    MidtransWebHook,
    GetAllTransaction,
    GetTransactionByOrderId,
    DeleteTransaction,
}