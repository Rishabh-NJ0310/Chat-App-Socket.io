import  User  from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateTokenAndSetCookie from "../utils/Tokens.js";


export const signup = async (req,res) => {
    try{
        const {name, username, email , password, confirmPassword, role } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({message: "Password does not match"});
        }
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error:"user already exist"});
        }
        // Hash password using Bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doctorProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const PatientProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        
        const newUser = new User({
            name, 
            username, 
            email, 
            password:hashedPassword, 
            profilePic: role === "doctor" ? doctorProfilePic : PatientProfilePic
        })
        if(newUser){
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic,
            role: newUser.role 
        })
        }else{
            return res.status(400).json({error:"Invalid user data"});
        }
    }catch(e){
        console.log("Error in signup controller", e.message);
        res.status(500).json({error: e.message})
    }
}


export const login = async (req,res) => {
    try{
        const {username , password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            res.status(400).json({error: "Invalid credentials"});
        }
        generateTokenAndSetCookie(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role
        })

    }catch(error){
        console.log("Error in login controller", e.message);
        res.status(500).json({error: e.message})
    }
}

export const loginout = (req,res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    }catch(e){
        console.log("Error in logout controller", e.message);
        res.status(500).json({error: e.message})
    }
}
