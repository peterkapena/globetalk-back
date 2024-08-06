import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import { UserType } from './models/user.js';

const app = express();
const server = createServer(app);

let io = new Server(server, {
  cors: { origin: "*" }
});

////////////////////////////////////////////////////////////

interface User {
  id: string;
  email: string;
  language: string;
  isHost: boolean;
  userType: UserType;
}

type RoomUsers = {
  [roomId: string]: User[];
};

interface SocketToRoom {
  [socketId: string]: string;
}
let users: RoomUsers = {};
let socketToRoom: SocketToRoom = {};

const BASIC_USER_LIMIT: number = 2// parseInt(process.env.BASIC_USER_LIMIT || '6');

io.on('connection', socket => {
  socket.on('join_room', data => {
    if (users[data.room]) {
      const length = users[data.room].length;

      var host = users[data.room].find(u => u.isHost)

      //If the host is a basic user, then the meeting is limited to a specific number of participants
      if (length === BASIC_USER_LIMIT && host?.userType === UserType.BASIC) {
        socket.emit('room_full');
        // console.log(length)
        return;
      }

      //check if this user is already in the room and exit so not add him twice
      if (users[data.room].some(user => user.id === socket.id)) {
        // console.log(`User ${socket.id} already in room ${data.room}`);
        return;
      }

      users[data.room].push({ id: socket.id, email: data.email, language: data.language, isHost: false, userType: data.userType });
    } else {
      users[data.room] = [{ id: socket.id, email: data.email, language: data.language, isHost: true, userType: data.userType }];
    }

    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socket.id}]: has entered in room ${socketToRoom[socket.id]}`);

    const usersInThisRoom = users[data.room].filter(user => user.id !== socket.id);

    // console.log(users[data.room]);

    io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
  });

  socket.on('offer', data => {
    //console.log(data.sdp);
    socket.to(data.offerReceiveID).emit('getOffer', data);
  });

  socket.on('answer', data => {
    //console.log(data.sdp);
    socket.to(data.answerReceiveID).emit('getAnswer', data);
  });

  socket.on('candidate', data => {
    //console.log(data.candidate);
    socket.to(data.candidateReceiveID).emit('getCandidate', data);
  })

  socket.on('updateLanguage', data => {
    socket.emit("getLanguage", { language: data, id: socket.id });
  });

  socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    if (roomID) {
      console.log(`[${roomID}]: ${socket.id} exit`);

      let room = users[roomID];
      if (room) {
        room = room.filter(user => user.id !== socket.id);
        users[roomID] = room;
        if (room.length === 0) {
          delete users[roomID];
          return;
        }
      }
      socket.to(roomID).emit('user_exit', { id: socket.id });
      // console.log(users);
    }
  })

  socket.on('muted', muted => {
    const roomID = socketToRoom[socket.id];
    socket.to(roomID).emit('muted', { muted, id: socket.id });
  })

  socket.on('mute_user', id => {
    io.sockets.to(id).emit('mute_user');
  })
});

///////////////////////////////////////////////////////////
const PORT = +process.env.SOCKET_PORT || 4001;

server.listen(PORT, () => {
  console.log(`🌏 Socket.io Server ready at http://localhost:${PORT}`);
});