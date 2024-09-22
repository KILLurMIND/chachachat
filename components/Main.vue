<template>
    <main>
        <ChatArea />
    </main>
</template>

<style scoped lang="less">
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: auto;

        .responsive(@tablet, {
            flex-direction: row-reverse;
        });
    }
</style>