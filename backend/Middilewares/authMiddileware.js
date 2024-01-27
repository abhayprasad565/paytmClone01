const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');
const authMilddileware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if ((!authHeader || !authHeader.startsWith('Bearer '))) {   // incorrect req 
        res.status.json({ error: true, message: "" })
    }
    const token = authHeader.split(' ')[1];
    // verify the token
    try {
        const decoded = jwt.verify(token, JWTSECRET);
        // check if token is valid 
        if (decoded && decoded.exp > Date.now()) {
            req.username = decoded.username;
            req.userId = decoded.userId;
            next();
        } else res.status(403).json({ error: true, message: "User Not Logged In" });
    }
    catch (error) {
        next(error);
    }

}
module.exports = authMilddileware;