<template>
  <div class="app-container">
    <Header />
    <ChatUserPanel />
    <Main />
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
        "main user-panel"; 
      grid-template-columns: 1fr auto; // Main занимает всю оставшуюся ширину, а user-list — авторазмер
      grid-template-rows: auto 1fr;
      gap: @sm-size;
      flex-wrap: wrap;

      header {
        grid-area: header;
      }

      main {
        grid-area: main;
      }

      .user-panel {
        grid-area: user-panel;
      }
    });
  }

</style>