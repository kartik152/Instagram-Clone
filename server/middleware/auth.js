const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async function(req, res, next){
    try{
        const fetchToken = req.header("Authorization").replace("Bearer ", "");
        const decode = await jwt.verify(fetchToken, "ThisIsMyToken");
        const user = await User.findOne({_id: decode._id, 'tokens.token': fetchToken});
        if(!user){
            throw new Error();
        }
        req.user = user;
        next();
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: "Please authenticate"});
    }
}

module.exports = auth;