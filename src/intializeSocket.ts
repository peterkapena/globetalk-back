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

      const { userType: hostUserType } = users[data.room].find(u => u.isHost);

      console.log(length)
      console.log(hostUserType)
      console.log(length === BASIC_USER_LIMIT)

      if (length === BASIC_USER_LIMIT && hostUserType === UserType.BASIC) {
        socket.emit('room_full');
        console.log(length)
        return;
      }

      if (users[data.room].some(user => user.id === socket.id)) {
        console.log(`User ${socket.id} already in room ${data.room}`);
        return;
      }

      users[data.room].push({ id: socket.id, email: data.email, language: data.language, isHost: false, userType: data.UserType });
    } else {
      users[data.room] = [{ id: socket.id, email: data.email, language: data.language, isHost: true, userType: data.userType }];
    }
    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    const usersInThisRoom = users[data.room].filter(user => user.id !== socket.id);

    console.log(users[data.room]);

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
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
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
    console.log(users);
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