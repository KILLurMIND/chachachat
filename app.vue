<template>
  <div class="app-container">
    <Header />
    <ChatUserPanel v-if="users.length > 0" :users="users" />
    <ChatArea :messages="processedMessages" @send-message="handleSendMessage" />
  </div>
  <Footer />
</template>

<script setup>
  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css'
      }
    ]
  })
  
  const { $socket } = useNuxtApp();
  
  const users = ref([]);
  const messages = ref([]);

  const handleNewMessage = (newMsg) => {
    messages.value.push(newMsg);
  };
  const handleSendMessage = (message) => {
    $socket.emit('chatMessage', message);
  };
  // Набор возможных цветов для пользователей
  const colorSet = ['#28E5FF', '#46FF28', '#FF2828'];
  
  const assignColorsToUsers = (newUserList) => {
    let availableColors = [...colorSet]; // Копируем доступные цвета
  
    // Создаем новый массив с назначенными цветами
    return newUserList.map((user) => {
      // Если это текущий пользователь, не назначаем цвет
      if (user.id === $socket.id) {
        return { ...user, color: null };
      }
    
      // Случайно выбираем цвет из доступных и удаляем его из списка
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      const assignedColor = availableColors.splice(randomIndex, 1)[0];
    
      return { ...user, color: assignedColor };
    });
  };
  
  const onCurrentUsers = (newUserList) => {
    // Сравнение старого и нового списка пользователей
    const oldUserIds = users.value.map((user) => user.id);
    const newUserIds = newUserList.map((user) => user.id);
  
    // Вычисляем, кто вошел (есть в новом, но нет в старом списке)
    const usersJoined = newUserList.filter((user) => !oldUserIds.includes(user.id));
  
    // Вычисляем, кто вышел (был в старом, но отсутствует в новом списке)
    const usersLeft = users.value.filter((user) => !newUserIds.includes(user.id));
  
    // Логируем пользователей, которые вошли
    usersJoined.forEach((user) => {
      console.log(`${$socket.id === user.id ? '(Это Вы)' : ''} Пользователь вошел: ${user.nickname} (ID: ${user.id})`);
    });
  
    // Логируем пользователей, которые вышли
    usersLeft.forEach((user) => {
      console.log(`Пользователь вышел: ${user.nickname} (ID: ${user.id})`);
    });
  
    // Присваиваем случайные цвета остальным пользователям и обновляем список
    users.value = assignColorsToUsers(newUserList);
  };

  // Функция для добавления цвета в каждое сообщение
  const processMessages = () => {
    return messages.value.map((message) => {
      const user = users.value.find(user => user.id === message.userId);
      return {
        ...message,
        color: user ? user.color : '#eee' // если пользователя нет, назначаем серый цвет
      };
    });
  };

  // Обработанные сообщения с цветом
  const processedMessages = computed(() => processMessages());

onMounted(() => {
  if ($socket && !$socket.connected) {
    $socket.connect();
    console.log('Socket is not initialized. Connecting...');
  }

  if ($socket) {
    console.log('Initializing socket events...');

    $socket.emit('userReady', (response) => {
      if (response === 'ok') {
        console.log('Сервер подтвердил событие userReady');
      } else {
        console.log('Произошла ошибка с событием userReady');
      }
    });

    // Получение данных пользователей
    $socket.on('currentUsers', onCurrentUsers);

    $socket.on('initMessages', (initialMessages) => {
      messages.value = initialMessages;
      console.log('Получение списка из 10 последних сообщений!');
    });

    $socket.on('newMessage', handleNewMessage);

    // Обработчик отключения
    $socket.on('disconnect', () => {
      console.log('Socket disconnected, ID:', $socket.id);
      
      setTimeout(() => $socket.connect(), 1500);
    });

    // Обработка ошибок переподключения
    $socket.on('connect_error', (error) => {
      console.error('Ошибка подключения:', error);
    });
  } else {
    $socket.connect();
    console.error('Socket is not initialized. Try to connect...');
  }
});

onBeforeUnmount(() => {
  if ($socket) {
    $socket.disconnect();
    console.log('Socket disconnected before unmount.');
  }
});

</script>

<style scoped lang="less">

  .app-container {
    display: flex;
    flex-direction: column;
    padding-bottom: @sm-size;

    .responsive(@tablet, {//.app-container
      display: grid;
      grid-template-areas: 
        "header header"
        "chat-area user-panel"; 
      grid-template-columns: 1fr auto; // chat-area занимает всю оставшуюся ширину, а user-panel — авторазмер
      grid-template-rows: auto 1fr;
      padding-bottom: 0;

      header {
        grid-area: header;
      }

      .chat-area {
        grid-area: chat-area;
      }

      .user-panel {
        grid-area: user-panel;
      }
    });
  }

</style>