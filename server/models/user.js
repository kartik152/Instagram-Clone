const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, "Atleast 3 characters"],
        max: [16, "Atmost 16 characters"] 
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is Invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: 4,
    },
    image: {
        type: String,
        default: "https://us.123rf.com/450wm/urfandadashov/urfandadashov1806/urfandadashov180601827/150417827-photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept.jpg?ver=6"
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.statics.findByCredentials = async(email, password) => {
    if(!email || !password){
        throw new Error("Please add all the fields");
    }
    const user = await User.findOne({email: email});
    if(!user){
        throw new Error("Email doesn't exist");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error("Password is wrong");
    }
    return user;
}

userSchema.statics.isUserExist = async(email, password, name) => {
    if(!email || !password || !name){
        throw new Error("Please add all the fields");
    }
    const user = await User.findOne({email: email});
    if(user){
        throw new Error("That email is already exists");
    }
}

userSchema.methods.generateToken = async(user) => {
    const token = await jwt.sign({_id: user._id.toString()}, "ThisIsMyToken", {expiresIn: "365 days"});
    user.tokens = user.tokens.concat({token: token});
    await user.save();
    return token;
}

userSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})
const User = new mongoose.model("User", userSchema);
module.exports = User;