<template>
    <div class="user-panel">
        <transition-group name="fade-scale" tag="div" class="user-list" mode="out-in">
            <div 
                v-for="user in users" 
                :key="user.id" 
                class="user-list__item" 
                :class="{ 'user-list__item--user' : user.id === $socket.id }" 
                :data-socket-id="user.id"
                :style="{ borderColor: user.color }">
                <div class="user-img" :style="{ backgroundImage: `url(${getAvatarUrl(user.avatar)})` }"></div>
                <div class="user-name" :style="{ color: user.color }">{{ user.nickname }}</div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
    const { $socket } = useNuxtApp();

    const props = defineProps({
        users: {
            type: Array,
            required: true
        }
    });

    const getAvatarUrl = (avatar) => `_nuxt/assets/imgs/avatars/${avatar}`;
</script>

<style scoped lang="less">

    .user-panel {
        top: 0;
        position: sticky;
        display: flex;
        align-items: center;
        gap: @xs-size;
        border-bottom: 2px solid @cl-muted;
        background: @cl-white;
        z-index: 2;

        .user-list {
            display: flex;
            align-items: start;
            gap: @xs-size;
            padding: @sm-size;
            overflow-x: auto;
            flex: 1;

            &__item {
            position: relative;
            display: flex;
            flex-direction: column-reverse;
            align-items: start;
            justify-content: space-between;
            aspect-ratio: 9 / 16;
            flex: 0 0 @xl-size;
            overflow: hidden;
            box-sizing: border-box;
            padding: @sm-size * (2 / 3);
            border: 2px solid @cl-black;
            border-radius: @sm-size * (2/3);
            opacity: 0; /* Исходное состояние – невидимый */
            transform: scale(0.9); /* Исходное состояние – уменьшенный */
            animation: fadeInScale 0.6s ease-out forwards; /* Анимация появления */

                .user-name {
                    z-index: 1;
                    width: 100%;
                    white-space: break-spaces;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1;
                }

                .user-img {
                    position: absolute;
                    inset: 0;
                    background-size: 125%;
                    background-position: @sm-size bottom; /* Показать левую половину */
                    background-repeat: no-repeat;
                }

                &:hover {
                    aspect-ratio: 1 / 1;
                    flex: 0 0 ((@xl-size / 9) * 16);

                    .user-img {
                        background-size: 100%;
                        background-position: @md-size bottom; /* Показать левую половину */
                    }
                }

                &--user {
                    background: @cl-gradient;
                    order: -1;
                    border: none;

                    .user-name {
                        color: @cl-white!important;
                        font-weight: 400;
                    }
                }
            }
        }

        .responsive(@tablet, {//.user-panel
            top: 0;
            flex-direction: column;
            justify-content: start;
            align-items: stretch;
            border: none;
            gap: 0;
            overflow: hidden auto;
            order: 1;

            .user-list {
                position: relative;
                flex-direction: column;
                align-items: end;
                overflow: visible;
                padding: 0 @sm-size;
                border-left: 2px solid @cl-muted;

                &__item {
                    flex: none;
                    height: @xl-size;
                    aspect-ratio: 16 / 9;

                    .user-img {
                        position: absolute;
                        inset: 0;
                        background-size: 70%;
                        background-position: @xl-size center; /* Показать левую половину */
                        background-repeat: no-repeat;
                    }

                    &:hover {
                        flex: none;
                        height: ((@xl-size / 9) * 16);
                    }
                }
            }

            &:hover {
                border-left: 4px solid @cl-purp;
            }

            &::before {
                content: '';
                position: sticky;
                width: 100%;
                min-height: @sm-size;
                pointer-events: none;
                z-index: 1;
                top: -1px;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            }
            &::after {
                content: '';
                position: sticky;
                width: 100%;
                min-height: @sm-size;
                pointer-events: none;
                z-index: 1;
                bottom: -1px;
                background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            }
        });
    }

    /* Анимация появления */
    .fade-scale-enter-active {
        animation: fadeInScale 0.6s ease-out forwards;
    }

    /* Анимация исчезновения */
    .fade-scale-leave-active {
        animation: fadeOutScale 0.6s ease-in forwards;
    }

    /* Состояние на последней фазе анимации удаления */
    .fade-scale-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }

    /* Ключевые кадры для появления */
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* Ключевые кадры для исчезновения */
    @keyframes fadeOutScale {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.9);
        }
    }

</style>