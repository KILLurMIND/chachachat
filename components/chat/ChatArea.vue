<template>
  <div class="chat-area">
    <div
      class="chat-area__streak"
      ref="streak_messages"
      @mousedown="startScroll"
      :class="{ 'is-dragging': isDragging }"
    >
      <transition-group name="fade" tag="div" class="chat-area__streak-messages">
        <div v-for="(message, index) in messages" :key="index" class="chat-streak__row" :class="{ 'chat-streak__row--user' : message.userId === $socket.id }" :data-socket-id="message.userId">
          <div class="chat-streak__message">
            <div class="chat-streak__message-time">{{ message.timestamp }}</div>
            <div class="chat-streak__message-txt"
              :style="{
                boxShadow: `0 2px 8px ${message.color}`,
              }"
            >{{ message.text }}</div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="chat-area__form">
      <input
        class="chat-area__form-input"
        v-model="inputMessage"
        id="messageInput"
        name="message"
        @keyup.enter="sendMessage"
        placeholder="Ваше сообщение"
      />
      <button class="chat-area__form-btn" @click="sendMessage"><i class="bi bi-arrow-up-circle"></i></button>
    </div>
  </div>
</template>

<script setup>

  const { $socket } = useNuxtApp();

  const emit = defineEmits(['send-message']);

  const props = defineProps({
    messages: {
      type: Array,
      required: true
    }
  });
  
  const inputMessage = ref('');

  const streak_messages = ref(null);
  
  let isDragging = false;
  let startY = 0;
  let scrollTop = 0;

  // Начало прокрутки
  const startScroll = (event) => {
    if (event.button !== 0) return; // только левая кнопка мыши
    isDragging = true;
    startY = event.clientY;
    scrollTop = streak_messages.value.scrollTop;

    streak_messages.value.classList.add('is-dragging');

    window.addEventListener('mousemove', handleScroll);
    window.addEventListener('mouseup', stopScroll);
    document.body.style.userSelect = 'none'; // отключить выделение текста
  };

  // Прокрутка
  const handleScroll = (event) => {
    if (!isDragging) return;
    const deltaY = event.clientY - startY;
    streak_messages.value.scrollTop = scrollTop - deltaY;
  };

  // Остановка прокрутки
  const stopScroll = () => {
    isDragging = false;

    streak_messages.value.classList.remove('is-dragging');

    window.removeEventListener('mousemove', handleScroll);
    window.removeEventListener('mouseup', stopScroll);
    document.body.style.userSelect = ''; // включить выделение текста обратно
  };

  const scrollToBottom = () => {
    if (streak_messages.value) {
      streak_messages.value.scroll({
        top: streak_messages.value.scrollHeight,
        behavior: 'smooth', // Добавляем плавную анимацию прокрутки
      });
    }
  };

  const sendMessage = () => {
    if (inputMessage.value.trim() !== '') {
      const message = {
        text: inputMessage.value,
      };
      emit('send-message', message); // Отправляем только текст
      inputMessage.value = '';
    }
  };
  
  onMounted(() => {

    $socket.on('newMessage', (newMsg) => {
      
      props.messages.push(newMsg);
      nextTick(scrollToBottom);
    });
    
    watch(
      () => props.messages,
      () => {
        nextTick(scrollToBottom); // Прокрутка вниз
      }
    );

  });


</script>

<style scoped lang="less">

  .chat-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-height: 100%;
    overflow: hidden;

    .chat-area__streak {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: start;
      overflow-x: hidden;
      overflow-y: auto;
      flex-grow: 1;
      
      &.is-dragging {
        cursor: grabbing;
      }

      .chat-area__streak-messages {
        padding: 0 @sm-size;

        .chat-streak__row {
          display: flex;
          align-items: start;
          margin-bottom: @xs-size;

          &--user {
            justify-content: end;

            .chat-streak__message {

              &-txt {
                color: @cl-white;
                background: @cl-gradient;
              }
            }

            &.fade-enter-from, .fade-leave-to {
              transform: translateX(100px);
            }
          }

          &:last-child {
            margin-bottom: 0;
          }

          .chat-streak__message {
            display: flex;
            align-items: center;
            gap: @xs-size;
            max-width: 90%;

            .responsive(@tablet, {
              max-width: 45%;
            });

            &-time {
              font-size: @xs-size * (2 / 3);
              color: lighten(@cl-black, 50%);
            }

            &-txt {
              padding: @xs-size;
              font-size: @xs-size;
              box-shadow: 0 2px 8px @cl-muted;
              border-radius: @sm-size;
              line-height: @sm-size;
              word-break: break-word;
              overflow-wrap: anywhere;
            }
          }
        }
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
    }
    .chat-area__form {
      display: flex;
      justify-content: center;
      padding: 0 @sm-size;
      

      .chat-area__form-input {
        flex: 1;
        padding: @sm-size;
        border: 2px solid @cl-muted;
        border-right: none;
        border-radius: @sm-size 0 0 @sm-size;
        font-size: @sm-size * (2 / 3);

        &:focus-visible, :hover {
          outline: none;
          border: 2px solid @cl-purp;
          border-right: none;
        }
      }

      .chat-area__form-btn {
        padding: @sm-size * (2 / 3);
        width: @md-size;
        aspect-ratio: 1 / 1;
        box-sizing: content-box;
        border: none;
        border-radius: 0 @sm-size @sm-size 0;
        background: @cl-gradient;
        color: @cl-white;
        font-size: @sm-size;
        cursor: pointer;
        background-size: 200% 200%;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), 
              background 0.4s ease-in-out, 
              box-shadow 0.4s ease-in-out;
        box-shadow: 0 0 0 @cl-purp;
        z-index: 1;

        &:hover {
          transform: translateY(-5px) scale(1.05) rotate(2deg);
          background-position: right left;
          box-shadow: 0 8px 24px @cl-purp;
        }

        &:active {
          transform: scale(0.95);
          background: lighten(@cl-purp, 10%);
        }
      }
    }

    .fade-enter-active, .fade-leave-active {
      transition: 0.35s ease-out;
    }
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
      transform: translateX(-100px);
    }

    .responsive(@tablet, {//.chat-area

      .chat-area__streak {
        padding: 0 @sm-size;

        &-messages {
          padding: 0!important;
        }
      }

      .chat-area__form {
        padding: @sm-size;
        padding-top: 0;
      }
    });
  }

</style>