const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const zod = require("zod");
const { JWTSECRET } = require("../config");
const { User, Account } = require("../db");
const authMilddileware = require('../Middilewares/authMiddileware');
const bcrypt = require('bcrypt');

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});
const loginSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
})
const updateSchema = zod.object({
    firstName: zod.string().optional(),
    password: zod.string().optional(),
    lastName: zod.string().optional(),
});

// Function to hash a password
const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Function to verify a password
const verifyPassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};
// signup func
const SignUp = async (req, res, next) => {
    // console.log(req.body.user);
    let inputUserObj = req.body.user;
    // vallidate the schema
    const { success } = signupSchema.safeParse(inputUserObj);
    if (!success) {
        return res.status(400).json({ message: " Incorrect Input" });
    }
    // check if user already presend
    const UserPresentCheck = await User.findOne({ username: inputUserObj.username })
    if (UserPresentCheck) {
        return res.status(400).json({ message: "Email already present" });
    }
    // create new user
    inputUserObj.password = await hashPassword(inputUserObj.password);
    const dbUser = await User.create({ ...inputUserObj });
    // create new Account
    const dbAccount = await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.floor(Math.random() * 10000),
    })
    await dbUser.save();
    await dbAccount.save();
    // return response
    res.json({ message: "User Created Sucessfully", success: true })
}
// login func

// login
const login = async (req, res, next) => {
    const { success } = loginSchema.safeParse(req.body.user);
    if (!success) return res.status(411).json({ message: "Invalid Credentials" });
    //console.log(req);
    const Inputuser = req.body.user;
    //console.log(Inputuser);
    const user = await User.findOne({ username: Inputuser.username });
    const match = await verifyPassword(Inputuser.password, user.password)
    if (!match) return res.status(401).json({ error: true, message: "Invalid password" });
    else {
        // Get the current timestamp
        const currentTimestamp = Date.now();
        // Calculate the expiration timestamp (15 days ahead)
        const expirationTimestamp = currentTimestamp + 15 * 24 * 60 * 60 * 1000;
        //console.log(JWTSECRET + " This is jwt")
        const token = jwt.sign({
            username: Inputuser.username,
            userId: user._id,
            exp: expirationTimestamp,
        }, JWTSECRET);
        // return json web token
        return res.json({ message: "User LoggedIn Sucessfully", token: token })
    }
}
// signup user
router.post("/signup", SignUp);
// login user
router.post("/login", login);
// find users via name
router.get("/bulk", authMilddileware, async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [
            { firstName: { "$regex": filter } },
            { lastName: { "$regex": filter } }
        ],
    });
    // return only username , firstname and lastname
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }))
    })
})
// get user data
router.get("/detail", authMilddileware, async (req, res) => {
    const user = await User.findById(req.userId);
    res.json({
        success: true, user: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            _id: user._id,
        }
    })
})
// update user
router.put("/", authMilddileware, async (req, res) => {
    const { success } = updateSchema.safeParse(req.body.user);
    if (!success) return res.status(411).json({ error: true, message: "Wrong data sent" });
    // find user
    const user = await User.findOne({ username: req.username });
    const { firstName, lastName, password } = req.body.user;
    // save new data
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = password;
    await user.save();
    // return response
    return res.json({ success: true, message: "User updated Sucessfully" });
})



module.exports = router;
