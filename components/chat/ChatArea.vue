<template>
  <div class="chat-area">
    <div class="chat-area__streak">
      <div v-for="(message, index) in messages" :key="index" class="chat-streak__row">
        <span>{{ message.timestamp }}</span> {{ message.text }}
      </div>
    </div>
    <div class="chat-area__form">
      <input class="chat-area__form-input" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="Enter a message" />
      <button class="chat-area__form-btn-send"></button>
    </div>
  </div>
</template>

<script setup>
  
</script>

<style scoped lang="less">

  .chat-area {
    display: block;
  }

</style>