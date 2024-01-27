const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const zod = require("zod");
const { JWTSECRET } = require("../config");
const { User, Account } = require("../db");
const authMilddileware = require('../Middilewares/authMiddileware');
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

// signup func
const SignUp = async (req, res, next) => {
    const inputUserObj = req.body.user;
    // vallidate the schema
    const { sucess } = signupSchema.safeParse(inputUserObj);
    if (!sucess) {
        res.status(400).json({ message: "Email already presend / Incorrect Input" });
    }
    // check if user already presend
    const UserPresentCheck = await User.findOne({ username: inputUserObj.username })
    if (UserPresentCheck._id) {
        res.status(400).json({ message: "Email already presend / Incorrect Input" });
    }
    // create new user
    const dbUser = await new User.create({ ...inputUserObj });
    // create new Account
    const dbAccount = await new Account.create({
        userId: dbUser._id,
        balance: 1 + Math.floor(Math.random() * 10000),
    })
    dbUser.save();
    // return response
    res.json({ message: "User Created Sucessfully", success: true })
}
// login func
const login = async (req, res, next) => {
    const { sucess } = loginSchema.safeParse(req.body.user);
    if (!sucess) res.status(411).json("Invalid Credentials");
    const Inputuser = req.body.user;
    const user = await User.findOne({ username: Inputuser.username });
    if (user.password != Inputuser.password) res.status(401).json({ error: true, message: "Invalid password" });
    else {
        // Get the current timestamp
        const currentTimestamp = Date.now();
        // Calculate the expiration timestamp (15 days ahead)
        const expirationTimestamp = currentTimestamp + 15 * 24 * 60 * 60 * 1000;

        const token = jwt.sign({
            username: Inputuser.username,
            userId: user._id,
            exp: expirationTimestamp,
        }, JWTSECRET);
        // return json web token
        res.json({ message: "User Created Sucessfully", token: token })
    }
}


// signup user
router.post("/signup", SignUp);
// login user
router.post("/login", login);
// find users via name
router.get("bulk", authMilddileware, async (req, res) => {
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

// update user
router.put("/", authMilddileware, async (req, res) => {
    const { sucess } = updateSchema.safeParse(req.body.user);
    if (!sucess) res.status(411).json({ error: true, message: "Wrong data sent" });
    // find user
    const user = await User.findOne({ username: req.username });
    const { firstName, lastName, password } = req.body.user;
    // save new data
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = password;
    await user.save();
    // return response
    res.json({ success: true, message: "User updated Sucessfully" });
})


module.exports = router;
