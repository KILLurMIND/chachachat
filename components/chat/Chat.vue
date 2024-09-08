<template>
    <ul class="messages">
      <li v-for="(message, index) in messages" :key="index">
        <span>{{ message.timestamp }}</span> {{ message.text }}
      </li>
    </ul>
    <input v-model="inputMessage" @keyup.enter="sendMessage" placeholder="Enter a message" />
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { io } from 'socket.io-client';
  import { db } from '@/firebase'; // Импорт Firebase
  import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
  import { format } from 'date-fns';
  
  const messages = ref([]);
  const inputMessage = ref('');
  let socket;
  
  onMounted(() => {
    // Подключение к серверу Socket.io
    socket = io('http://localhost:3001');
  
    // Подписка на изменения в коллекции "messages" Firestore
    const messagesCollection = collection(db, 'messages');
    const q = query(messagesCollection, orderBy('timestamp'));
  
    onSnapshot(q, (snapshot) => {
      messages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        timestamp: format(doc.data().timestamp.toDate(), 'HH:mm') // Форматирование временной метки
      }));
    });
  
    // Получение сообщений от Socket.io и сохранение их в Firestore
    socket.on('chat message', async (msg) => {
      try {
        await addDoc(messagesCollection, {
          text: msg,
          timestamp: new Date(),
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    });
  });
  
  const sendMessage = () => {
    if (inputMessage.value.trim() !== '') {
      // Отправка сообщения на сервер
      socket.emit('chat message', inputMessage.value);
      inputMessage.value = ''; // Очистка поля ввода
    }
  };
</script>