const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
allParticipants = {};
call_rooms = {};  
participants = {};
const io = socket(server, {
    cors:{
        origins: ["*"],
        methods: ["GET", "POST"],
        handlePreflightRequest: (req, res) => {
            const headers = {
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            };
            res.writeHead(200, headers);
            res.end();
        }
    }
});

io.on('connection', (socket) => {
    console.log('connection made with ' + socket.id);
    allParticipants[socket.id] = true;
    io.to(socket.id).emit('emit-participant-id', socket.id);

    socket.on('join-call-room', join_data =>{
        let call_room = call_rooms[join_data.room_id];
        if(call_room){
            call_rooms[join_data.room_id].push(socket.id);
        }
        else{
            myID = socket.id;
            call_rooms[join_data.room_id] = [myID,];
        }
        console.log("Socket ID = " + socket.id);
        socket.join(join_data.room_ID); 
        participants[socket.id] = join_data.room_ID;
        console.log("user : " + join_data.new_participant_id + " joined to room : " + join_data.room_ID);
        socket.to(join_data.room_ID).emit('new-participant-joined',join_data);
        socket.on('stopping-screen-share', (data) => {
            socket.to(data.room_id).emit('remote-screen-share-stop', data.id);
        });
        socket.on('broadcast-message-to-room', (messageObject) => {
            console.log('request to broadcast message : ' + messageObject.message.messageText + ' to room');
            socket.to(join_data.room_ID).emit('new-message-received', {messageObject : messageObject, join_data : join_data});
        });
        socket.on('raise-hand', userData => {
            socket.to(join_data.room_ID).emit('user-raised-hand', userData);
        });
        socket.on('lower-hand', userData => {
            socket.to(join_data.room_ID).emit('user-lowered-hand', userData);
        });
        socket.on('disconnect', () => { 
            console.log('disconnecting now ');
            socket.to(join_data.room_ID).emit('participant-disconnected', join_data.new_participant_id);
        })


    });
}); 


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));