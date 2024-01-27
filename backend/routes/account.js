const express = require('express');
const router = express.Router();
const { Account, User } = require('../db');
const { Mongoose } = require('mongoose');


// implemented via transaction in a database
const transferFunds = async (senderid, receiverId, balance) => {
    // initiate a transaction
    const session = await Mongoose.startSession();
    // anything in between start and end either happens all or rolles back all
    try {
        // check snder acc
        const senderAcc = await Account.findOne({ userId: senderid }).session(session);
        if (!senderAcc || senderAcc.balance < balance) {
            session.abortTransaction();
            return { success: false, code: 403, res: { message: "Invalid Acc or Insuffecient Funds", error: true } };
        }
        // check reciever acc
        const receiverAcc = await Account.findOne({ userId: receiverId }).session(session);
        if (!receiverAcc) {
            session.abortTransaction();
            return { success: false, code: 403, res: { message: "Invalid Sender Acc", error: true } };
        }
        // Perform the transfer
        senderAcc.balance = senderAcc.balance - balance;
        receiverAcc.balance = receiverAcc.balance + balance;
        await senderAcc.save().session(session);
        await receiverAcc.save().session(session);
        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();
        return { success: true, code: 200, res: { message: "Transaction Done Sucessfully", success: true } };

    } catch (error) {
        // log error
        console.error("Error in transfer operation:", error);
        await session.abortTransaction();
        await session.endSession();
        return { success: false, code: 500, res: { message: "internal Server Error", error: true } };;
    }

}

// get balance
router.get("/balance", async (req, res) => {
    // get balance
    const Account = await Account.findOne({ userId: req.userId });
    if (!Account) return res.status(403).json({ message: "Invalid User", error: true });
    res.json({ balance: Account.balance, success: true });
});
// transfer funds
router.post("/transfer", async (req, res) => {
    const senderid = req.userId;
    const receiverId = req.body.receiverId;
    const balance = req.body.amount;
    const status = await transferFunds(senderid, receiverId, balance);
    return res.status(status.code).json(status.res);
})


module.exports = router;