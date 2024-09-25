import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase.js'; // Импорт Firestore

// Определение текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // В продакшене стоит ограничить домены
    methods: ['GET', 'POST'],
  },
});

// Функция для форматирования времени
const formatTime = (timestamp) => {
  const date = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Аватары и ники пользователей
const userPool = [
  { avatar: 'doggy.png', nickname: 'Мистер Дог' },
  { avatar: 'foxy.png', nickname: 'Мис Лис' },
  { avatar: 'frog.png', nickname: 'Мистер Фрог' },
  { avatar: 'kitty.png', nickname: 'Мис Кис' },
];

let allowedUsers = [];
const MAX_ALLOWED_USERS = userPool.length;

// Основная логика работы с сокетами
io.on('connection', async (socket) => {
  console.log('Подключен пользователь:', socket.id);

  // Проверяем лимит пользователей
  if (allowedUsers.length >= MAX_ALLOWED_USERS) {
    socket.emit('chatFull', { message: 'Чат заполнен. Попробуйте позже.' }, (ack) => {
      if (ack === 'received') {
        console.log(`Отключение пользователя ${socket.id} по причине переполнения`);
        socket.disconnect(true);
      }
    });
    return;
  }

  // Назначаем свободного пользователя
  const availableUsers = userPool.filter(user => !allowedUsers.some(u => u.nickname === user.nickname));
  const user = { ...availableUsers[Math.floor(Math.random() * availableUsers.length)], id: socket.id };
  allowedUsers.push(user);
  
  // Присоединяем пользователя к комнате
  socket.join('chatRoom');
  console.log(`Пользователь ${user.nickname} (${socket.id}) добавлен. Всего пользователей: ${allowedUsers.length}`);

  // Получаем последние 10 сообщений из Firestore
  const messages = await loadMessages();

  // Ожидаем готовности пользователя и отправляем данные
  socket.on('userReady', (callback) => {
    console.log(`Отправлены данные для пользователя ${socket.id}`);
    socket.emit('initMessages', messages);
    io.to('chatRoom').emit('currentUsers', allowedUsers);
    console.log(`Отправлены данные для пользователя ${socket.id}`);
    
    if (callback) {
      callback('ok');  // Ответ клиенту, что запрос был принят
    }
  });

  // Обработка входящих сообщений
  socket.on('chatMessage', async (msg) => {
    const sender = allowedUsers.find(u => u.id === socket.id);
    if (sender) {
      const messageData = {
        message: msg,
        userId: sender.id,
        nickname: sender.nickname,
        avatar: sender.avatar,
        timestamp: new Date(),
      };
      await saveMessage(messageData);
      io.to('chatRoom').emit('newMessage', { ...messageData, timestamp: formatTime(messageData.timestamp) });
    }
  });

  // Обработка отключения пользователя
  socket.on('disconnect', () => {
    allowedUsers = allowedUsers.filter(u => u.id !== socket.id);
    io.to('chatRoom').emit('currentUsers', allowedUsers);
    console.log(`Пользователь ${socket.id} отключен\n-----------------\n`);
  });
});

// Функция загрузки сообщений из Firestore
const loadMessages = async () => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: formatTime(data.timestamp),
      };
    }).reverse();
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
    return [];
  }
};

// Функция сохранения сообщения в Firestore
const saveMessage = async (messageData) => {
  try {
    await addDoc(collection(db, 'messages'), messageData);
  } catch (error) {
    console.error('Ошибка сохранения сообщения:', error);
  }
};

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});