import { io } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:3001'); // URL сервера Socket.IO

  socket.on('connect', () => {
    console.log(`Socket ID's :: ${socket.id}`);
  });

  nuxtApp.provide('socket', socket);
});