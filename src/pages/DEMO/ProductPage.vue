<script>
import DemoProductsGrid from 'src/widgets/DemoProductsGrid/ui/DemoProductsGrid.vue';

export default {
  name: "ProductPage",
  components: {DemoProductsGrid},
  data() {
    return {
      rating: 5,
      searchReview: '',
      selectedRating: null,
      ratingOptions: [
        {label: 'Все оценки', value: null},
        {label: '5 звезд', value: 5},
        {label: '4 звезды', value: 4},
        {label: '3 звезды', value: 3},
        {label: '2 звезды', value: 2},
        {label: '1 звезда', value: 1}
      ],
      currentSlide: 1,
      slides: [
        {
          id: 1,
          image: 'https://cdn.quasar.dev/img/parallax2.jpg'
        },
        {
          id: 2,
          image: 'https://cdn.quasar.dev/img/parallax1.jpg'
        },
        {
          id: 3,
          image: 'https://cdn.quasar.dev/img/mountains.jpg'
        },
        {
          id: 4,
          image: 'https://cdn.quasar.dev/img/parallax2.jpg'
        }
      ]
    }

  }
}
</script>

<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-xl">
      <q-breadcrumbs-el label="Главная" icon="home"/>
      <q-breadcrumbs-el label="Одежда"/>
      <q-breadcrumbs-el label="Футболки"/>
      <q-breadcrumbs-el label="Футболка темно-синяя однотонная"/>
    </q-breadcrumbs>

    <!-- Основная информация о товаре -->
    <div class="row q-col-gutter-xl">
      <div class="col-7">
        <!-- Главное изображение -->
        <q-card flat bordered class="q-mb-sm">
          <q-carousel
            v-model="currentSlide"
            animated
            infinite
            arrows
            height="400px"
            class="rounded-borders"
          >
            <q-carousel-slide
              v-for="slide in slides"
              :key="slide.id"
              :name="slide.id"
              :img-src="slide.image"
            />
          </q-carousel>
        </q-card>

        <!-- Миниатюры -->
        <div class="row q-col-gutter-xs justify-center">
          <div
            v-for="slide in slides"
            :key="slide.id"
            class="col-auto"
          >
            <q-card
              flat
              bordered
              class="cursor-pointer thumb-card"
              :class="{ 'thumb-active': currentSlide === slide.id }"
              @click="currentSlide = slide.id"
            >
              <q-img
                :src="slide.image"
                ratio="1"
                width="80px"
                height="80px"
                class="rounded-borders"
              />
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-5">
        <div class="column justify-between" style="height: 100%">
          <div>
            <h4 class="q-mt-none q-mb-md text-weight-bold">Футболка темно-синяя однотонная</h4>
            <p class="text-grey-7 q-mb-lg">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab dicta
              doloribus iure soluta.</p>

            <q-list bordered class="rounded-borders q-mb-lg">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Бренд</q-item-label>
                  <q-item-label>Adidas</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Доставка</q-item-label>
                  <q-item-label>Завтра (Пермь ул Уинская)</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Рейтинг</q-item-label>
                  <div class="row items-center">
                    <q-rating
                      v-model="rating"
                      size="1.5em"
                      color="orange"
                      readonly
                      class="q-mr-sm"
                    />
                    <span class="text-caption text-grey-7">228 отзывов</span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div>
            <div class="row items-center q-mb-sm">
              <span class="text-h4 text-weight-bold text-primary q-mr-md">300₽</span>
              <span class="text-h6 text-strike text-grey">350₽</span>
              <q-badge color="red" class="q-ml-sm">-10%</q-badge>
            </div>

            <q-btn
              label="Добавить в корзину"
              color="primary"
              size="lg"
              icon="shopping_cart"
              class="full-width q-mb-md"
              to="/cart/"
              unelevated
            />

            <q-btn
              label="Купить в 1 клик"
              color="deep-orange"
              outline
              to="/checkout/"
              class="full-width"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Характеристики товара -->
    <q-card flat class="q-mt-xl q-mb-xl">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">Характеристики товара</div>

        <q-list bordered separator>
          <!-- Основные характеристики -->
          <q-expansion-item
            group="specs"
            label="Основные характеристики"
            default-opened
            header-class="text-weight-bold"
          >
            <q-card>
              <q-card-section>
                <div class="row q-col-gutter-lg">
                  <div class="col-6">
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Бренд</q-item-label>
                          <q-item-label>Adidas</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Модель</q-item-label>
                          <q-item-label>Essential</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col-6">
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Страна производства</q-item-label>
                          <q-item-label>Китай</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Сезон</q-item-label>
                          <q-item-label>Лето 2024</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- Состав и уход -->
          <q-expansion-item
            group="specs"
            label="Состав и уход"
            header-class="text-weight-bold"
          >
            <q-card>
              <q-card-section>
                <div class="row q-col-gutter-lg">
                  <div class="col-6">
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Состав</q-item-label>
                          <q-item-label>100% хлопок</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col-6">
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Уход</q-item-label>
                          <q-item-label>Машинная стирка при 30°C</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- Размеры -->
          <q-expansion-item
            group="specs"
            label="Размеры и посадка"
            header-class="text-weight-bold"
          >
            <q-card>
              <q-card-section>
                <div class="row q-col-gutter-lg">
                  <div class="col-6">
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Размерная сетка</q-item-label>
                          <q-item-label>S, M, L, XL, XXL</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Посадка</q-item-label>
                          <q-item-label>Прилегающая</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col-6">
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Длина рукава</q-item-label>
                          <q-item-label>Короткий</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Воротник</q-item-label>
                          <q-item-label>Круглый</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Отзывы -->
    <q-card flat class="q-mb-xl">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">Отзывы</div>

        <div class="row q-col-gutter-xl">
          <!-- Левая колонка - статистика -->
          <div class="col-4">
            <q-card bordered class="text-center q-pa-lg">
              <div class="text-h2 text-weight-bold text-primary">4.8</div>
              <q-rating
                v-model="rating"
                size="2em"
                color="orange"
                readonly
                class="q-mb-sm"
              />
              <div class="text-caption text-grey-7">228 отзывов</div>
            </q-card>

            <q-btn
              label="Написать отзыв"
              color="primary"
              icon="rate_review"
              class="full-width q-mt-lg q-mb-lg"
              unelevated
            />

            <q-card bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Распределение оценок</div>
              <div v-for="stars in [5,4,3,2,1]" :key="stars" class="row items-center q-mb-xs">
                <div class="col-3">
                  <span class="text-caption">{{ stars }} звезд</span>
                </div>
                <div class="col-7">
                  <q-linear-progress
                    :value="[0.85, 0.12, 0.05, 0.02, 0.01].reverse()[stars-1]"
                    color="orange"
                    size="10px"
                  />
                </div>
                <div class="col-2 text-right">
                  <span class="text-caption text-grey">{{ [193, 27, 5, 2, 1].reverse()[stars - 1] }}</span>
                </div>
              </div>
            </q-card>
          </div>

          <!-- Правая колонка - отзывы и фильтры -->
          <div class="col-8">
            <!-- Фильтры -->
            <q-card bordered class="q-pa-md q-mb-lg">
              <div class="row items-center q-col-gutter-md">
                <div class="col-8">
                  <q-input
                    v-model="searchReview"
                    placeholder="Поиск по отзывам..."
                    dense
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                </div>
                <div class="col-4">
                  <q-select
                    v-model="selectedRating"
                    :options="ratingOptions"
                    label="Фильтр по оценке"
                    dense
                    outlined
                    emit-value
                    map-options
                  />
                </div>
              </div>

              <div class="q-mt-md">
                <div class="text-caption text-weight-medium q-mb-sm">Быстрый выбор оценки:</div>
                <div class="row q-col-gutter-xs">
                  <div class="col-auto" v-for="star in [5,4,3,2,1]" :key="star">
                    <q-btn
                      :label="`${star}`"
                      :color="selectedRating === star ? 'primary' : 'grey-5'"
                      :text-color="selectedRating === star ? 'white' : 'dark'"
                      size="sm"
                      padding="xs sm"
                      @click="selectedRating = selectedRating === star ? null : star"
                    >
                      <q-icon name="star" size="xs" class="q-mr-xs"/>
                    </q-btn>
                  </div>
                </div>
              </div>
            </q-card>

            <!-- Список отзывов -->
            <div class="column q-gutter-y-md">
              <!-- Отзыв 1 -->
              <q-card bordered>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div class="row items-center">
                      <q-avatar size="lg" class="q-mr-sm">
                        <img src="https://cdn.quasar.dev/img/avatar.png">
                      </q-avatar>
                      <div>
                        <div class="text-weight-bold">Александр П.</div>
                        <div class="text-caption text-grey-6">15 мая 2024</div>
                      </div>
                    </div>
                    <q-rating v-model="rating" size="1.5em" color="orange" readonly/>
                  </div>

                  <div class="q-mb-sm">
                    <q-badge color="green" class="q-mr-xs">Достоинства</q-badge>
                    <span class="text-caption">Отличное качество, удобная, не линяет после стирки</span>
                  </div>

                  <div class="q-mb-sm">
                    <q-badge color="red" class="q-mr-xs">Недостатки</q-badge>
                    <span class="text-caption">Немного маломерит</span>
                  </div>

                  <p class="q-mb-md">
                    Футболка отличного качества! Ткань плотная, приятная к телу. После нескольких стирок не села и не
                    полиняла.
                    Рекомендую брать на размер больше, так как немного маломерит.
                  </p>

                  <div class="row q-gutter-xs q-mb-md">
                    <q-img
                      v-for="n in 2"
                      :key="n"
                      src="https://cdn.quasar.dev/img/parallax2.jpg"
                      width="80px"
                      height="80px"
                      class="rounded-borders"
                    />
                  </div>

                  <!-- Комментарии -->
                  <q-card flat class="bg-grey-2">
                    <q-card-section>
                      <div class="row items-start">
                        <q-avatar size="sm" class="q-mr-sm">
                          <img src="https://cdn.quasar.dev/img/avatar3.jpg">
                        </q-avatar>
                        <div>
                          <div class="text-weight-bold">Представитель магазина</div>
                          <p class="q-my-xs">Спасибо за отзыв! Да, действительно, рекомендуем выбирать размер на один
                            больше, если предпочитаете свободную посадку.</p>
                          <div class="text-caption text-grey-6">16 мая 2024</div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <div class="row items-center q-mt-md">
                    <q-btn flat icon="thumb_up" label="15" size="sm" color="primary"/>
                    <q-btn flat icon="thumb_down" label="2" size="sm" color="primary" class="q-ml-sm"/>
                    <q-space/>
                    <q-btn flat icon="reply" label="Ответить" size="sm" color="primary"/>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Отзыв 2 -->
              <q-card bordered>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div class="row items-center">
                      <q-avatar size="lg" class="q-mr-sm">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                      </q-avatar>
                      <div>
                        <div class="text-weight-bold">Марина К.</div>
                        <div class="text-caption text-grey-6">10 мая 2024</div>
                      </div>
                    </div>
                    <q-rating v-model="rating" size="1.5em" color="orange" readonly/>
                  </div>

                  <div class="q-mb-sm">
                    <q-badge color="green" class="q-mr-xs">Достоинства</q-badge>
                    <span class="text-caption">Качественный пошив, хорошая ткань, удобная</span>
                  </div>

                  <p class="q-mb-md">
                    Покупала мужу, очень доволен. Сидит хорошо, ткань дышащая. Цвет соответствует фото.
                    Доставка быстрая. Рекомендую!
                  </p>

                  <div class="row items-center q-mt-md">
                    <q-btn flat icon="thumb_up" label="8" size="sm" color="primary"/>
                    <q-btn flat icon="thumb_down" label="0" size="sm" color="primary" class="q-ml-sm"/>
                    <q-space/>
                    <q-btn flat icon="reply" label="Ответить" size="sm" color="primary"/>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Кнопка показать еще -->
            <div class="text-center q-mt-lg">
              <q-btn
                label="Показать еще отзывы"
                color="primary"
                outline
                icon="expand_more"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Похожие товары -->
    <section>
      <h6 class="text-h5 text-weight-bold q-mb-md">Похожие товары</h6>
      <DemoProductsGrid/>
    </section>

  </q-page>
</template>
<style>
.thumb-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumb-card:hover {
  border-color: #1976d2;
}

.thumb-active {
  border-color: #1976d2 !important;
}
</style>

