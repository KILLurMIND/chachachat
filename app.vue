<template>
  <div class="app-container">
    <Header />
    <Main />
  </div>
  <Footer />
</template>

<style scoped lang="less">

  .app-container {
    display: flex;
    flex-direction: column;
    gap: @sm-size;
  }

</style>