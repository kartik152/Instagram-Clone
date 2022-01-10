const express = require("express");
const router = new express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");

// Create Post
router.post("/createPost", auth, async(req, res) => {
    try{
        const post = new Post({
            ...req.body,
            createdBy: req.user._id
        });
        await post.save();
        res.send(post);
        // res.send({message: "Post Created"});
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Get All Post
router.get("/allPost", async(req, res) => {
    try{
        const posts = await Post.find({}).populate("createdBy", "_id name").populate("comments.createdBy", "_id name").sort({createdAt: -1});
        res.send(posts);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Get My Post
router.get("/myPost", auth, async(req, res) => {
    try{
        const myPosts = await Post.find({createdBy: req.user._id});
        res.send(myPosts);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Delete My Post
router.delete("/deletePost/:postId", auth, async(req, res) => {
    // const {postId} = req.body;
    const postId = req.params.postId
    try{
        const post = await Post.findById({_id: postId});
        if(!post){
            throw new Error("Post doesn't exist");
        }
        if(post.createdBy.toString() !== req.user._id.toString()){
            throw new Error("You are the not creator of this Post");
        }
        const result = await Post.findByIdAndDelete(postId);
        console.log("Result ", result);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Get Specific Post
router.get("/post/:postId", auth, async(req, res) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findById(postId);
        res.send(post);
    }
    catch(e){
        console.log(e);
        res.send({error: e.message});
    }
})

// Update My Post
router.patch("/updatePost/:postId", auth, async(req, res) => {
    // const {postId} = req.body;
    const postId = req.params.postId;
    try{
        const post = await Post.updateOne({$and: [{_id: postId}, {createdBy: req.user._id}]}, {$set: req.body});
        if(!post){
            throw new Error("Post doesn't exist");
        }
        res.send(post);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Add Comment
router.put("/comment", auth, async(req, res) => {
    const {text, postId} = req.body;
    const comment = {
        text: text,
        createdBy: req.user._id
    }
    try{
        const post = await Post.findByIdAndUpdate({_id: postId}, {$push: {comments: comment}}, {new: true}).populate("createdBy", "_id name").populate("comments.createdBy", "_id name");
        res.send(post);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Delete my Comment
router.put("/deleteComment/:postId", auth, async(req, res) => {
    const {commentId} = req.body;
    try{
        const post = await Post.findById(req.params.postId);
        const comments = [...post.comments];
        const index = comments.findIndex(comment => {
            return comment._id.toString() === commentId.toString()
        })
        
        if(index !== -1){
            if(comments[index].createdBy.toString() === req.user._id.toString()){
                comments.splice(index, 1);
            }
        }
        console.log(comments);
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {$set: {comments: comments}}, {new: true}).populate("createdBy", "_id name").populate("comments.createdBy", "_id name");
        console.log(updatedPost);
        res.send(updatedPost);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Update my Comment
router.put("/updateComment/:postId", auth, async(req, res) => {
    const {commentId, text} = req.body;
    try{
        const post = await Post.findById(req.params.postId);
        if(!post){
            throw new Error("post doesn't exist");
        }
        const comments = post.comments;
        const index = comments.findIndex(comment => comment._id.toString() === commentId);
        // const specificComment = comments[index];
        comments[index].text = text;
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {$set: {comments: comments}}, {new: true});
        res.send(updatedPost);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Like post
router.put("/liked/:postId", auth, async(req, res) => {
    try{
        const post = await Post.findById({_id: req.params.postId});
        if(!post){
            throw new Error("Post doesn't exist");
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {$push: {like: req.user._id}}, {new: true}).populate("createdBy", "_id name").populate("comments.createdBy", "_id name");
        res.send(updatedPost);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

// Unlike post
router.put("/unLiked/:postId", auth, async(req, res) => {
    try{
        const post = await Post.findById({_id: req.params.postId});
        if(!post){
            throw new Error("Post doesn't exist");
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {$pull: {like: req.user._id}}, {new: true}).populate("createdBy", "_id name").populate("comments.createdBy", "_id name");
        res.send(updatedPost);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e.message});
    }
})

module.exports = router;