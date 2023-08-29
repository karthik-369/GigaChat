import Room from '../models/rooms.js'
import fs from 'fs';
const sockets = (socket) =>{
    console.log("Connection is ready");
    socket.on('send-message',( {message, roomId })=>{

        let skt = socket.broadcast;
        skt = roomId? skt.to(roomId):skt;
        skt.emit('message-from-server',{message});


        // socket.broadcast.emit('message-from-server', {message});
        console.log("message received ", message);
    });

    socket.on('typing-started-from-user',({roomId})=>{
        let skt = socket.broadcast
        skt = roomId?skt.to(roomId):null;
        if(skt==null){
            skt = socket.broadcast;
        }
        skt.emit('typing-started-from-server');
        // socket.broadcast.emit('typing-started-from-server');
    })

    socket.on('typing-stopped-from-user',({roomId})=>{
        let skt = socket.broadcast;
        skt = roomId?skt.to(roomId):skt;
        if(skt==null){
            skt = socket.broadcast;
        }
        skt.emit('typing-stopped-from-server');
        // socket.broadcast.emit('typing-stopped-from-server');
    })

    socket.on('join-room',({roomId})=>{
        console.log("Join room", roomId);
        socket.join(roomId);
        
    });

    socket.on('new-room-created', ({roomId, userId})=>{
        const room = new Room({
            name: 'Test',
            roomId,
            userId,
        })
        room.save();
        socket.broadcast.emit('new-room-created',{roomId});
    });


    socket.on('room-removed-from-user',async({roomId})=>{
        await Room.deleteOne({roomId});
        socket.broadcast.emit('room-removed-from-server', {roomId})
    });

    socket.on('upload', ({data, roomId})=>{
        // console.log(data); 
        const image = data
        fs.writeFile("upload/"+"test.png", data, {encoding: "base64"},()=>{

        });
        socket.to(roomId).emit("uploaded",{buffer:data.toString("base64")});
        // console.log(image);
    });

}

export default sockets;
