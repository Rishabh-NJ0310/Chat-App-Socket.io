import express from 'express'
import { Server } from "socket.io"
import http from 'http'
import { Socket } from 'dgram';
const app = express();


const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET","POST"]
    }
});


export const getReceiverSocketId  = (receiverId) =>{
    return userSocketMap[receiverId];
}
const userSocketMap = {}; // {userId: , socketId}

io.on('connection', (socket)=>{
    console.log("user connected with  id : ", socket.id)
    const userId = socket.handshake.query.userId
    if(userId != "undefined"){
        userSocketMap[userId] = socket.id;
        
        // this will send message to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
    socket.on("disconnect", ()=>{
        console.log("user disconnected with id : ", socket.id)
        delete userSocketMap(userId);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})
export {app, io, server}