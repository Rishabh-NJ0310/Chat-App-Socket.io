import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const secret = "qwertyuiop123456789asdfghjkl";
const generateTokenAndSetCookie = (userId, res) =>{
    const Token = jwt.sign({userId}, secret, {
        expiresIn: '7d'
    })
    res.cookie("jwt", Token, {
        maxAge: 15*24*60*60*1000, //milisecond format
        httpOnly: true, // prevent XS attacks cross-site scripting attacks
        sameSite: "strict",    
    });
}

export default generateTokenAndSetCookie;