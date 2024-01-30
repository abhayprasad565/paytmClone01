const express = require("express");
const mainRouter = require("./routes/index");
const { MONGOURL, JWTSECRET } = require("./config");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

// connect to mongoose 
const ConnectMongo = async () => {
    try {
        await mongoose.connect(MONGOURL);
    } catch (error) {
        console.log(error.message);
    }
};
ConnectMongo();
// initialize app
const app = express();


app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.use("/api/v1", mainRouter);




app.use((req, res, next) => {
    res.status(404).json({ message: "Page not FOund" });
})
// default error handler
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
})
app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("COnnected to port 3000");
})

