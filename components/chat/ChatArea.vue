<template>
  <div class="chat-area">
    <div class="chat-area__streak">
      <div v-for="(message, index) in messages" :key="index" class="chat-streak__row">
        <span>{{ message.timestamp }}</span> {{ message.text }}
      </div>
    </div>
    <div class="chat-area__form">
      <input class="chat-area__form-input" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="Ваше сообщение" />
      <button class="chat-area__form-btn-send"><i class="bi bi-arrow-up-circle"></i></button>
    </div>
  </div>
</template>

<script setup>
  
  onMounted(() => {

    

  });


</script>

<style scoped lang="less">

  .chat-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0 @sm-size;

    .chat-area__streak {
      display: flex;
      flex-grow: 1;
    }
    .chat-area__form {
      display: flex;
      justify-content: center;
      

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

      .chat-area__form-btn-send {
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
  }

</style>