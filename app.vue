<template>
  <div class="app-container">
    <Header />
    <Main>
      <Chat />
      <UserArea />
    </Main>
    <Footer />
  </div>
</template>

<style lang="less">

  .app-container {
    display: flex;
    flex-direction: column;
    font-size: @sm-size * (2/3);
  }
</style>