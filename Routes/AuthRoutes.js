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
const Community = mongoose.model("Community");

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



/////////////////// user login ////////////////////////

router.post("/userLogin",async(req,res)=>{
    const{email ,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send({error:"user not found"});
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(!isPasswordValid){
            return res.status(401).send({error:"Invalid password"});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn:"10m",
        });

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error("Database Error", error);
        return res.status(500).send({error:"Internal server error"});
    }
});

////////////////check if user is already a member//////////////

router.get("/checkMembership/:userId/:community", async (req, res) => {
    const { userId, community } = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user || !user.joinedCommunities) {
            return res.json({ isMember: false });
        }

        res.json({ isMember: user.joinedCommunities.includes(community) });
    } catch (error) {
        console.error("Error checking membership:", error);
        res.status(500).json({ error: "Server error" });
    }
});


////////////////////////// join a community /////////////////////

router.post("/joinCommunity", async (req, res) => {
    const { userId, hobby } = req.body;
    
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Initialize `joinedCommunities` if undefined
        if (!user.joinedCommunities) user.joinedCommunities = [];

        if (!user.joinedCommunities.includes(hobby)) {
            user.joinedCommunities.push(hobby);
            await user.save();
        }

        let community = await Community.findOne({ name: hobby });
        if (!community) {
            community = new Community({ name: hobby, members: [] });
        }

        // Ensure `members` array exists
        if (!community.members) community.members = [];

        if (!community.members.includes(userId)) {
            community.members.push(userId);
            await community.save();
        }

        res.json({ message: "Joined successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

////////////////// get details logged user ////////////////////

router.get('/loggedUserDetails',authMiddleware,async(req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if(typeof userId !== 'string'){
            return res.status(400).json({error:'Invalid user Id'});
        }

        if(!user){
            return res.status(404).json({
                error:"User not found"
            });
        };

        res.json({
            name:user.name,
            country:user.country,
            joinedCommunities: user.joinedCommunities,

        })
    } catch (error) {
        console.error("Error fetching user details:" , error);
        res.status(500).json({error:"Internal server error"});
    }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

  // Create Post API
router.post("/createPost", authMiddleware, upload.array("media", 5), async (req, res) => {
    try {
        const { caption, community } = req.body;
        const userId = req.user.userId; // Get user from authMiddleware

        // Store file paths in database
        const mediaPaths = req.files.map((file) => file.path);

        const newPost = new Post({
            name: req.user.name, // Assuming `name` is stored in req.user
            community,
            caption,
            media: mediaPaths,
            createdAt: new Date()
        });

        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;