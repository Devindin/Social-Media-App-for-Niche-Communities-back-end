const jwt = require('jsonwebtoken');
require ("dotenv").config();

const authMiddleware =(req,res,next)=>{
    const authHeader = req.header("Authorization");
    const token = authHeader.split(" ")[1];


if(!token){
    return res.status(401).json({error:"token not provided"})
}

try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
}catch(error){
    console.error("Authentication Error:");
    return res.status(401).json({error:"invalid token"});
}

}
module.exports = authMiddleware;