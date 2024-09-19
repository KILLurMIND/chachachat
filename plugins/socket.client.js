import { io } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:3001'); // URL сервера Socket.IO

  nuxtApp.provide('socket', socket);
});