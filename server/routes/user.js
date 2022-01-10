const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

// Signup user
router.post("/signup", async(req, res) => { 
    const {name, email, password} = req.body;
    try{
        await User.isUserExist(email, password, name);
        const user = new User(req.body);
        await user.save();
        res.send(user);
    }
    catch(e){
        console.log(e.message);
        res.send({error: e.message});
    }
})

// Singin User
router.post("/signin", async(req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findByCredentials(email, password);
        const token = await user.generateToken(user);
        res.send({user: user, token: token});
    }
    catch(e){
        res.send({error: e.message});
    }
})

// Follow User
router.put("/follow", auth, async(req, res) => {
    const {userId} = req.body;
    try{
        const followedUser = await User.findByIdAndUpdate(userId, {$push: {followers: req.user._id}}, {new: true});
        const followingUser = await User.findByIdAndUpdate(req.user._id, {$push: {following: userId}}, {new: true});
        console.log(followingUser);          
        res.send(followedUser);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Unfollow User
router.put("/unfollow", auth, async(req, res) => {
    const {userId} = req.body;
    try{
        const followedUser = await User.findByIdAndUpdate(userId, {$pull: {followers: req.user._id}}, {new: true});
        const followingUser = await User.findByIdAndUpdate(req.user._id, {$pull: {following: userId}}, {new: true});
        res.send(followedUser);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Update picture
router.patch("/updatePic", auth, async(req, res) => {
    const {image} = req.body;
    try{
        const user = await User.findByIdAndUpdate(req.user._id, {$set: {image: image}}, {new: true});
        res.send(user);
    }
    catch(e){
        res.status(422).send({error: e.message});
    }
})
module.exports = router;