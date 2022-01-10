const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const userProfile = require("./routes/userProfile");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/InstagramDB", {useNewUrlParser:true, useUnifiedTopology: true});

app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(userProfile);
app.listen(5000, async(req, res) => {
    console.log("Server is running on port 5000");
})