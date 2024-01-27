const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accountRouter = require("./account");
const authMiddileware = require("../Middilewares/authMiddileware");



router.use("/user", userRouter);
router.use('/account', authMiddileware, accountRouter);



module.exports = router;