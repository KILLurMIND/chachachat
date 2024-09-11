import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import db from './firebase-admin.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // Адрес вашего Nuxt приложения
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],  // Транспортные методы
  pingTimeout: 60000,  // Таймаут для соединений (увеличен для отладки)
});

const users = new Map();
const userProfiles = [
  { avatar: 'doggy.png', nickname: 'Клёвая Собака' },
  { avatar: 'foxy.png', nickname: 'Прикольный Лис' },
  { avatar: 'frog.png', nickname: 'Смышлённый Лягушёнок' },
  { avatar: 'kitty.png', nickname: 'Милый Кот' }
];

io.on('connection', async (socket) => {
  if (users.size === userProfiles.length) {
    socket.emit('chat error', 'Достигнуто максимальное количество пользователей');
    socket.disconnect();
    return;
  }

  console.log('a user connected ' + socket.id);

  const userProfile = userProfiles.splice(Math.floor(Math.random() * userProfiles.length), 1)[0];
  users.set(socket.id, { ...userProfile, id: socket.id });
  console.log(users);
  socket.emit('user properties', { ...userProfile });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    console.log('user disconnected ' + socket.id + '\n' + users);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});