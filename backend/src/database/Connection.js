import mongoose from 'mongoose'
const MONGO_URI = "mongodb://127.0.0.1:27017/chatApp"
const connection = async()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    }catch(e){
        console.log("Error in connecting to database",e)
    }
}
export default connection;