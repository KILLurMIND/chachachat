<template>
    <footer>
        <div class="grey-zone">
            <div class="info-about-project">
                <div class="info-about-project__title">Приложение создано с целью демонстрации навыков</div>
                <div class="info-about-project__dev-access"></div>
            </div>
            <a class="hh-label" href="#" target="__blank" ref="hhLabel">
                <div class="hh-label__logo"><img class="hh-label__logo" src="@/assets/imgs/hh-logo.svg" alt="hh_logo"></div>
                <div class="hh-label__user-name">Кирилл<br>Шуляка</div>
            </a>
            <div class="copyright">© 2024 ChaChaChat</div>
        </div>
    </footer>
</template>

<style scoped lang="less">

    footer {
        display: flex;
        padding: @sm-size;
        padding-top: 0;

        a {
            text-decoration: none;
            color: inherit;
        }

        .grey-zone {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: @sm-size;
            flex: 1;
            justify-content: space-between;
            padding: @sm-size;
            background: @cl-muted;
            border-radius: @sm-size;

            .info-about-project__title {
                color: fade(#404040, 50);
                text-align: center;
            }

            .hh-label {
                display: flex;
                position: relative;
                align-items: center;
                justify-content: center;
                gap: @sm-size * (2/3) * (2/3);
                padding: @sm-size;
                border-radius: @sm-size;
                background: @cl-white;
                transition: 0.35s ease-out; /* Анимация плавного возвращения */

                .hh-label__logo {
                    aspect-ratio: 1 / 1;
                    width: 36px;
                }

                &::after {
                    top: 0;
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    content: 'my name is';
                    font-family: 'Dancing Script';
                    font-size: @sm-size * (2/3);
                    color: @cl-white;
                    opacity: 1;
                }

                &:hover {
                    background: radial-gradient(circle at top left, #D6001C 60%, #a50016 100%);;
                    box-shadow: 0px 0px 84px 24px rgba(214, 0, 28, 0.2);
                    transform: scale(1.5);

                    .hh-label__user-name {
                        color: @cl-white;
                    }
                }
            }

            .copyright {
                color: fade(#404040, 50);;
            }
        }

        .responsive(@tablet, {
            .grey-zone {
                flex-direction: row;

                .info-about-project {
                    order: 2;

                    &__title {
                    text-align: left;
                }
                }

                .hh-label {
                    order: 1;
                }

                .copyright {
                    white-space: nowrap;
                    order: 3;
                }
            }
        });

        .responsive(@desktop, {
            
        });
    }

</style>

<script setup>
import { ref, onMounted } from 'vue';

const hhLabel = ref(null);

onMounted(() => {
  const box = hhLabel.value;

  // Проверка, что элемент существует
  if (box) {
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left; // Позиция курсора относительно элемента
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / centerX; // Нормализованное смещение от центра
      const moveY = (y - centerY) / centerY;

      box.style.transform = `perspective(300px) rotateX(${moveY * 20}deg) rotateY(${moveX * -20}deg) scale(1.15)`;
    });

    box.addEventListener('mouseleave', () => {
      box.style.transform = 'perspective(50px) rotateX(0deg) rotateY(0deg)';
    });
  }
});
</script>