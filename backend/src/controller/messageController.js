import Conversation from "../models/ConversationModel.js";
import Message from "../models/messageModel.js"
import { getReceiverSocketId } from "../sockets/socket.js";
export const sendMessage = async (req,res) =>{
    try{
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })
        if(newMessage){
            conversation.message.push(newMessage._id);
        }
        await Promise.all([newMessage.save(), conversation.save()]);
        // Socket IO 
        // <---------------> 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // io.to will send message to specific socket id
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }catch(e){
        console.log("Error is in SendMessage Controller",e)
        res.status(500).json({e:"Internal Server Error"})
    }
}

export const getMessages = async (req,res) =>{
    try{
        const {id: userToChatId} = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
        participants: {$all: [senderId, userToChatId]}
        }).populate('message');
        const messages = conversation.message;
        res.status(200).json(messages);
    }catch(e){
        console.log("Error is in getMessages Controller",e)
        res.status(500).json({e:"Internal Server Error"})
    }
}