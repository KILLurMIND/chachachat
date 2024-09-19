// server/server.js

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Определение текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Для разработки. В продакшене настрой более безопасно
    methods: ['GET', 'POST'],
  },
});

// Определяем набор аватаров и никнеймов
const userPool = [
  { avatar: 'doggy.png', nickname: 'Мистер Дог' },
  { avatar: 'foxy.png', nickname: 'Мис Лис' },
  { avatar: 'frog.png', nickname: 'Мистер Фрог' },
  { avatar: 'kitty.png', nickname: 'Мис Кис' },
  // Добавь другие, если нужно
];

let connectedUsers = [];

// Обслуживание статических файлов аватаров
/* app.use('/avatars', express.static(path.join(__dirname, 'avatars'))); */

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Connected users:', connectedUsers.length);

  // Проверяем, не превышено ли количество пользователей
  if (connectedUsers.length >= userPool.length) {
    socket.emit('chatFull', { message: 'Чат заполнен. Попробуйте позже.' }, () => { socket.disconnect(true); });
    return;
  }

  // Фильтруем свободных пользователей
  const availableUsers = userPool.filter(
    (user) => !connectedUsers.some((u) => u.nickname === user.nickname)
  );
  const user = availableUsers[Math.floor(Math.random() * availableUsers.length)];

  user.id = socket.id;

  connectedUsers.push(user);
  user.value = [];

  //Отправка списков пользователей
  io.emit('currentUsers', connectedUsers);

  // Ожидаем, пока клиент не сообщит, что готов принять список пользователей
  socket.on('readyForUsers', () => {
    console.log(`${socket.id} - полностью загрузился и готов получать инфу.`);
    socket.emit('currentUsers', connectedUsers);
  });

  // Обработка отключения
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers = connectedUsers.filter((u) => u.id !== socket.id);
    
    io.emit('currentUsers', connectedUsers);
  });

  // Обработка сообщений
  socket.on('chatMessage', (msg) => {
    const user = connectedUsers.find((u) => u.id === socket.id);
    if (user) {
      io.emit('newMessage', { nickname: user.nickname, avatar: user.avatar, message: msg });
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO сервер запущен на порту ${PORT}`);
});