import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "You are not authorized"});
        }
        const decoded = jwt.verify(token, "qwertyuiop123456789asdfghjkl"/*.env file not working*/);
        if(!decoded){
            return res.status(401).json({message: "You are not authorized - Invalid token"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        req.user = user;
        next();


    }catch(e){
        console.log("Error is in protect Route Middleware",e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export default protectRoute;