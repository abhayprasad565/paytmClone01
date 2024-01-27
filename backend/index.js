const express = require("express");
const mainRouter = require("./routes/index");
const { MONGOURL, JWTSECRET } = require("./config");
const cors = require('cors');

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



app.use("/api/v1", mainRouter);





app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("COnnected to port 3000");
})

