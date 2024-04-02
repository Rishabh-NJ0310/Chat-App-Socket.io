import User from "../models/userModel.js";

export const getUserForSideBar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        res.status(200).json({filteredUsers})

    }catch(e){
        console.log("Error is in getUserForSideBar Controller",e)
        res.status(500).json({e:"Internal Server Error"})
    }
}