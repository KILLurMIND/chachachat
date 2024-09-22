<template>
    <header>
        <img class="logo" src="@/assets/imgs/logo.svg" alt="logo">
    </header>
</template>

<style scoped lang="less">

    header {
        display: flex;
        background: @cl-white;
        padding: 0 @sm-size;
        padding-top: @lg-size;

        .responsive(@tablet, {
            padding-top: @sm-size;
            margin-bottom: @sm-size;
        });
    }

</style>