const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cors = require("cors");


const authMiddleware = require("../Middleware/authMiddleware");


////////////////////////////////////////
const User = mongoose.model("User");
///////////////////////////////////////


require("dotenv").config();

///////////////////////////////////////



///////////////////////// Add new user ////////////////

router.post('/addNewUser',async(req,res)=>{
    console.log("sent by the client side -", req.body);

    const{name , email, gender,country ,password , confirmpassword}=req.body;

    try {
        const hashPassword = await bcrypt.hash(password,10);
        const hashconfirmPassword = await bcrypt.hash(confirmpassword,10);

        const user = new User({
            name,
            email,
            gender,
            country,
            password:hashPassword,
            confirmpassword:hashconfirmPassword,
        });

        await user.save();
        res.send({message:"user registered successfully"});
    } catch (error) {
        console.log("Database error" ,error);
        return res.status(422).send({error:error.message});
    }
});





module.exports = router;