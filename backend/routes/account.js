const express = require('express');
const router = express.Router();
const { Account, User, Transaction } = require('../db');
const mongoose = require('mongoose');


// implemented via transaction in a database
const transferFunds = async (senderid, receiverId, balance) => {
    // initiate a transaction
    const session = await mongoose.startSession();
    // anything in between start and end either happens all or rolles back all
    try {
        session.startTransaction();
        // check snder acc
        const senderAcc = await Account.findOne({ userId: senderid }).session(session);
        console.log(senderAcc);
        if (!senderAcc || senderAcc.balance < balance) {
            session.abortTransaction();
            return { success: false, code: 403, res: { message: "Invalid Acc or Insuffecient Funds", error: true } };
        }
        // check receiver acc
        const receiverAcc = await Account.findOneAndUpdate({ userId: receiverId }).session(session);
        if (!receiverAcc) {
            session.abortTransaction();
            return { success: false, code: 403, res: { message: "Invalid Sender Acc", error: true } };
        }
        await Account.updateOne({ userId: senderid }, { $inc: { balance: -balance } }).session(session);
        await Account.updateOne({ userId: receiverId }, { $inc: { balance: balance } }).session(session);
        // save the transfer
        const transaction = await Transaction.create({
            sender: senderid,
            receiver: receiverId,
            balance: balance,
        });
        // Commit the transaction
        await session.commitTransaction();
        return { success: true, code: 200, res: { message: "Transaction Done Sucessfully", success: true } };

    } catch (error) {
        // log error
        console.error("Error in transfer operation:", error);
        await session.abortTransaction();
        return { success: false, code: 500, res: { message: "internal Server Error", error: true } };;
    }

}

// get balance
router.get("/balance", async (req, res) => {
    try {
        // Get account details
        const account = await Account.findOne({ userId: req.userId });

        // Check if the account exists
        if (!account) {
            return res.status(404).json({ message: "User account not found", error: true });
        }

        // Retrieve transactions for the user
        const transactions = await Transaction.find({
            $or: [{ sender: req.userId }, { receiver: req.userId }]
        }).populate('sender')
            .populate('receiver');
        //console.log(transactions);
        const tran = transactions.map(tran => {
            return {
                _id: tran._id,
                time: tran.time,
                balance: tran.balance,
                sender: {
                    firstName: tran.sender.firstName,
                    lastName: tran.sender.lastName,
                    username: tran.sender.username,
                },
                receiver: {
                    firstName: tran.receiver.firstName,
                    lastName: tran.receiver.lastName,
                    username: tran.receiver.username,
                }
            }
        })

        // Return balance and transactions
        res.json({ balance: account.balance, success: true, transactions: tran });
    } catch (error) {
        console.error("Error while fetching account details:", error);
        res.status(500).json({ message: "Internal Server Error", error: true });
    }

});
// transfer funds
router.post("/transfer", async (req, res) => {
    const senderid = req.userId;

    const receiver = await User.findOne({ username: req.body.receiverId })
    console.log(req.body)
    if (!receiver) return res.status(403).json({ error: true, message: "Wrong Inputs" });
    const balance = req.body.amount;
    const status = await transferFunds(senderid, receiver._id, balance);

    return res.status(status.code).json(status.res);
})


module.exports = router;