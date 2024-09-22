<template>
  <div class="app-container">
    <Header />
    <ChatUserPanel />
    <ChatArea />
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

  onMounted(() => {

    $socket.emit('readyForUsers');

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