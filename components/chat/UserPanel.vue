<template>
    <transition-group name="fade-scale" tag="div" class="user-panel">
        <div class="user-list">
            <div 
                v-for="user in users" 
                :key="user.id" class="user-list__item" 
                :class="{ 'user-list__item--user' : user.id === $socket.id }" 
                :data-socket-id="user.id"
                :style="{ borderColor: user.color }">
                <div class="user-img" :style="{ backgroundImage: `url(${getAvatarUrl(user.avatar)})` }"></div>
                <div class="user-name" :style="{ color: user.color }">{{ user.nickname }}</div>
            </div>
        </div>
    </transition-group>
</template>

<script setup>
    const { $socket } = useNuxtApp();

    const users = ref([]);

    const colorSet = ['#28E5FF', '#46FF28', '#FF2828', '#FFD028'];

    // Функция для получения URL аватара
    const getAvatarUrl = (avatar) => `_nuxt/assets/imgs/avatars/${avatar}`;

    const assignUserColors = (currentUsers) => {
        currentUsers.forEach((user, index) => {
            if (!user.color) {
                // Назначаем цвет пользователю, используя индекс
                user.color = colorSet[index % colorSet.length];
            }
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
          console.log(`${$socket.id === user.id ? '(Это Вы)' : ''}Пользователь вошел: ${user.nickname} (ID: ${user.id})`);
        });
    
        // Логируем пользователей, которые вышли
        usersLeft.forEach((user) => {
          console.log(`Пользователь вышел: ${user.nickname} (ID: ${user.id})`);
        });
    
        //Раздаем цвет локально
        assignUserColors(newUserList);
        // Обновляем текущий список пользователей
        users.value = newUserList;
    };

    // Обработчик успешного переподключения
    const onReconnect = () => {
      console.log('Соединение восстановлено. Ваш socket ID:', $socket.id);
      $socket.emit('readyForUsers'); // Запрашиваем обновленный список пользователей
    };

    const onDisconnect = () => {
      users.value = [];
      console.log('Соединение потеряно, ждем переподключения...');
    };

    // Настройка событий сокета
    const setupSocketEvents = () => {
        $socket.on('currentUsers', onCurrentUsers);
        $socket.on('disconnect', onDisconnect);
        $socket.on('reconnect', onReconnect);
    };

    // Отключение событий сокета
    const offSocketEvents = () => {
      $socket.off('currentUsers', onCurrentUsers);
      $socket.off('disconnect', onDisconnect);
    };

    // Обработка и настройка сокета при монтировании
    onMounted(() => {
        const handleConnection = () => {
          console.log(`Подключение установлено. Socket ID: ${$socket.id}`);
          setupSocketEvents();
          $socket.emit('readyForUsers');
        };

        if ($socket.connected) {
          handleConnection();
        } else {
          $socket.once('connect', handleConnection);
        }

        // Обработка переподключений
        $socket.on('reconnect', onReconnect);

        // Обработка ошибок подключения
        $socket.on('connect_error', (error) => console.error('Ошибка подключения:', error));
        $socket.on('reconnect_error', (error) => console.error('Ошибка переподключения:', error));
    });

    // Очистка обработчиков перед размонтированием
    onBeforeUnmount(() => {
      offSocketEvents();
    });
</script>

<style scoped lang="less">

    .user-panel {
        top: @sm-size;
        position: sticky;
        display: flex;
        align-items: center;
        gap: @xs-size;
        overflow: hidden;
        border-bottom: 2px solid @cl-muted;
        background: @cl-white;

        .user-list {
            display: flex;
            align-items: start;
            gap: @xs-size;
            padding: 0 @sm-size;
            padding-bottom: @sm-size;
            overflow-x: auto;

            &__item {
            position: relative;
            display: flex;
            flex-direction: column-reverse;
            align-items: start;
            justify-content: space-between;
            aspect-ratio: 9 / 16;
            flex: 0 0 @xl-size;
            overflow: hidden;
            box-sizing: border-box;
            padding: @sm-size * (2 / 3);
            border: 2px solid @cl-black;
            border-radius: @sm-size * (2/3);
            opacity: 0; /* Исходное состояние – невидимый */
            transform: scale(0.9); /* Исходное состояние – уменьшенный */
            animation: fadeInScale 0.6s ease-out forwards; /* Анимация появления */

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
                    aspect-ratio: 1 / 1;
                    flex: 0 0 ((@xl-size / 9) * 16);

                    .user-img {
                        background-position: @md-size center; /* Показать левую половину */
                    }
                }

                &--user {
                    background: @cl-gradient;
                    order: -1;
                    border: none;

                    .user-name {
                        color: @cl-white!important;
                        font-weight: 400;
                    }
                }
            }
        }

        .responsive(@tablet, {//.user-panel
            top: 0;
            flex-direction: column;
            justify-content: start;
            align-items: stretch;
            border: none;
            gap: 0;
            overflow: hidden auto;
            border-left: 2px solid @cl-muted;

            .user-list {
                position: relative;
                flex-direction: column;
                align-items: end;
                overflow: visible;
                padding: 0 @sm-size;
                flex: 1;

                &__item {
                    flex: none;
                    width: @xl-size;
                    aspect-ratio: 1 / 1;

                    &:hover {
                        flex: none;
                        width: (@xl-size / (2/3));
                    }
                }
            }

            &:hover {
                border-left: 4px solid @cl-purp;
            }

            &::before {
                content: '';
                position: sticky;
                width: 100%;
                min-height: @sm-size;
                pointer-events: none;
                z-index: 1;
                top: -1px;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            }
            &::after {
                content: '';
                position: sticky;
                width: 100%;
                min-height: @sm-size;
                pointer-events: none;
                z-index: 1;
                bottom: -1px;
                background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            }
        });
    }

    /* Анимация появления */
    .fade-scale-enter-active {
        animation: fadeInScale 0.6s ease-out forwards;
    }

    /* Анимация исчезновения */
    .fade-scale-leave-active {
        animation: fadeOutScale 0.6s ease-in forwards;
    }

    /* Ключевые кадры для появления */
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* Ключевые кадры для исчезновения */
    @keyframes fadeOutScale {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.9);
        }
    }

</style>