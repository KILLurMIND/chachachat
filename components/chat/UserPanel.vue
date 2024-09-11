<template>
    <div class="user-panel">
      <div v-for="user in users" :key="user.id" class="user-panel__item" :class="{ 'user-panel__item--user': user.id === userId }">
        <div class="user-img" :style="{ backgroundImage: `url(${user.avatar})` }"></div>
        <div class="user-name">{{ user.nickname }}</div>
      </div>
    </div>
</template>

<script setup>

    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import io from 'socket.io-client';

    const socket = io('http://localhost:3001', {
        transports: ['websocket'], // Укажите только WebSocket
    });

    const users = ref([]);
    const userId = ref(null);

    onMounted(() => {
        
        // Логирование ID сокета при успешном подключении
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          userId.value = socket.id;
        });

        socket.on('user properties', (data) => {
            console.log(data);
        });

        socket.on('user connected', (user) => {
          console.log('User connected:', user);
          user.avatar = `/imgs/avatars/${user.avatar}`;
          users.value.push(user);
        });

        socket.on('user disconnected', (user) => {
          console.log('User disconnected:', user);
          users.value = users.value.filter((u) => u.id !== user.id);
        });

        socket.on('disconnect', () => {
          console.log(`Socket disconnected: ${socket.id}`);
        });

    });
       
    onBeforeUnmount(() => {
      // Отключаем сокет при размонтировании компонента
      socket.disconnect();
    });

</script>

<style scoped lang="less">

    .user-panel {
        top: @sm-size * (2 / 3);
        position: sticky;
        display: flex;
        align-items: center;
        gap: @sm-size * (2/3);
        overflow-y: auto;
        border-bottom: 2px solid @cl-muted;
        padding: 0 @sm-size;
        padding-bottom: @sm-size;
        background: @cl-white;

        &__item {
            position: relative;
            display: flex;
            flex-direction: column-reverse;
            align-items: start;
            justify-content: space-between;
            flex: 0 0 @xl-size;
            aspect-ratio: 9 / 16;
            overflow: hidden;
            box-sizing: border-box;
            padding: @sm-size * (2 / 3);
            border: 2px solid @cl-black;
            border-radius: @sm-size * (2/3);

            .user-name {
                z-index: 1;
                width: 100%;
                white-space: break-spaces;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1;
            }

            .user-img {
                position: absolute;
                inset: 0;
                background-size: cover;
                background-position: @sm-size center; /* Показать левую половину */
                background-repeat: no-repeat;                
            }

            &:hover {
                aspect-ratio: 16 / 16;
                flex: 0 0 ((@xl-size / 9) * 16);

                .user-img {
                    background-position: @md-size center; /* Показать левую половину */
                }
            }
            
            &--user {
                background: linear-gradient(135deg, #5D00F4, #351863);
                order: 0;
                border: none;

                .user-name {
                    color: @cl-white;
                    font-weight: 400;
                }

                .user-img {
                    
                }
            }
        }
    }

</style>