<template>
    <main>
        <ChatUserPanel />
        <ChatArea />
    </main>
</template>

<style scoped lang="less">
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding-bottom: @sm-size;

        .responsive(@tablet, {
            overflow: auto;
            flex-direction: row-reverse;
        });
    }
</style>