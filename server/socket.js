import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase.js'; // Firestore instance

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // В продакшене обязательно ограничьте домены
    methods: ['GET', 'POST'],
  },
});

// Максимальное количество пользователей
const MAX_ALLOWED_USERS = 4;

// Пул готовых пользователей
const userPool = [
  { avatar: 'doggy.png', nickname: 'Мистер Дог' },
  { avatar: 'foxy.png', nickname: 'Мис Лис' },
  { avatar: 'frog.png', nickname: 'Мистер Фрог' },
  { avatar: 'kitty.png', nickname: 'Мис Кис' },
];

let allowedUsers = [];

// Форматирование времени для сообщений
const formatTime = (timestamp) => {
  const date = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Загрузка последних сообщений из Firestore
const loadMessages = async () => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: formatTime(doc.data().timestamp),
    })).reverse();
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
    return [];
  }
};

// Сохранение сообщения в Firestore
const saveMessage = async (messageData) => {
  try {
    await addDoc(collection(db, 'messages'), messageData);
  } catch (error) {
    console.error('Ошибка сохранения сообщения:', error);
  }
};

// Логика работы с сокетами
io.on('connection', async (socket) => {
  console.log('\nПодключен пользователь:', socket.id);

  // Если чат полон, отключаем пользователя
  if (allowedUsers.length >= MAX_ALLOWED_USERS) {
    socket.emit('chatFull', { message: 'Чат заполнен. Попробуйте позже.' }, (ack) => {
      if (ack === 'received') {
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
  console.log(`Пользователь ${user.nickname} добавлен. Всего пользователей: ${allowedUsers.length}`);

  // Ожидание события userReady
  socket.on('userReady', async (callback) => {
    console.log('Получено событие userReady от:', socket.id + '\n');

    // Загружаем последние сообщения
    const messages = await loadMessages();
    
    // Отправляем инициализацию данных пользователю
    socket.emit('initMessages', messages);
    io.to('chatRoom').emit('currentUsers', allowedUsers);

    // Подтверждаем обработку события
    if (callback) callback('ok');
  });

  // Обработка отправки нового сообщения
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
    console.log(`Пользователь ${socket.id} отключен`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});