import { io } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:3001', {
    reconnection: true, 
    reconnectionAttempts: 10, // Увеличить количество попыток переподключения
    reconnectionDelay: 2000,  // Задержка между попытками
    timeout: 30000,           // Время ожидания соединения
  });

  // Обработка переподключения
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  // Обработка переподключения
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect(); // Попытка переподключения, если отключено сервером
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Ошибка подключения к сокету:', error);
  });

  // Обработка переполнения чата
  socket.on('chatFull', (data, callback) => {
    if (callback) callback('received');
    socket.disconnect();
    alert(data.message);
  });

  nuxtApp.provide('socket', socket);
});