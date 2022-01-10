const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = new express.Router();

// Specific User Profile
router.get("/user/:userId", auth, async(req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        res.send(user);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }


})

// My Profile
router.get("/myProfile", auth, async(req, res) => {
    try{
        const myProfile = await User.findById(req.user._id);
        res.send(myProfile);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }


})



module.exports = router;