// plugins/socket.client.js
import { io } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:3001', {
    autoConnect: false,
    reconnection: true, // Автоматическая попытка переподключения
    reconnectionAttempts: 5, // Количество попыток переподключения
    reconnectionDelay: 1000, // Задержка перед переподключением
    timeout: 20000, // Время ожидания подключения
  });

  socket.on('connect', () => {
    console.log(`Socket connected with id: ${socket.id}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${reason}`);
    if (reason === 'io server disconnect') {
      // Если сервер явно отключил клиента
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Ошибка подключения к сокету:', error);
  });

  // Глобальная обработка переполнения чата
  socket.on('chatFull', (data, callback) => {
    if (callback) callback('received');
    socket.disconnect();
    alert(data.message);
  });

  nuxtApp.provide('socket', socket);
});