<template>
  <div class="app-container">
    <Header />
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
</script>

<style scoped lang="less">

  .app-container {
    display: flex;
    flex-direction: column;
    gap: @sm-size;
  }

</style>