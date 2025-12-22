<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-xl">
      <q-breadcrumbs-el label="Главная" icon="home"/>
      <q-breadcrumbs-el label="Корзина" />
    </q-breadcrumbs>

    <div class="text-h4 text-weight-bold q-mb-lg">Корзина</div>

    <div class="row q-col-gutter-xl">
      <!-- Левая колонка - товары -->
      <div class="col-md-8 col-12">
        <q-card flat bordered>
          <q-card-section>
            <!-- Шапка с выбором всех -->
            <div class="row items-center q-mb-md">
              <q-checkbox
                v-model="selectAll"
                label="Выбрать все"
                class="text-weight-medium"
              />
              <q-space />
              <q-btn
                flat
                dense
                color="negative"
                icon="delete"
                label="Удалить выбранные"
                v-if="selectedItems.length > 0"
              />
            </div>

            <q-separator class="q-mb-md" />

            <!-- Список товаров -->
            <div class="column q-gutter-y-lg">
              <q-item v-for="item in cartItems" :key="item.id" class="q-pa-none">
                <q-item-section avatar>
                  <q-checkbox v-model="selectedItems" :val="item.id" />
                </q-item-section>

                <q-item-section avatar>
                  <q-img
                    :src="item.image"
                    width="80px"
                    height="80px"
                    class="rounded-borders"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ item.description }}</q-item-label>
                  <q-item-label>
                    <q-badge v-if="item.discount" color="red">
                      -{{ item.discount }}%
                    </q-badge>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="column items-end q-gutter-y-xs">
                    <div class="text-h6 text-weight-bold text-primary">
                      {{ item.finalPrice }}₽
                    </div>
                    <div v-if="item.discount" class="text-caption text-strike text-grey">
                      {{ item.originalPrice }}₽
                    </div>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <div class="column items-center q-gutter-y-xs">
                    <q-btn
                      round
                      dense
                      flat
                      icon="remove"
                      size="sm"
                      :disable="item.quantity <= 1"
                      @click="decreaseQuantity(item.id)"
                    />
                    <div class="text-weight-medium">{{ item.quantity }} шт.</div>
                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      size="sm"
                      @click="increaseQuantity(item.id)"
                    />
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    color="grey"
                    icon="delete"
                    @click="removeItem(item.id)"
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-card-section>
        </q-card>

        <!-- Рекомендации -->
        <div class="q-mt-xl">
          <div class="text-h5 text-weight-bold q-mb-md">Рекомендуем</div>
          <DemoProductsGrid/>
        </div>
      </div>

      <!-- Правая колонка - итоги -->
      <div class="col-md-4 col-12" :class="$q.screen.lt.md ? 'order-first' : ''" >
        <q-card flat bordered style="position: sticky; top: 0; left: 0">
          <q-card-section>
            <div class="column q-gutter-y-md">
              <!-- Кнопка оформления -->
              <q-btn
                label="Перейти к оформлению"
                color="primary"
                size="lg"
                icon="shopping_cart"
                class="full-width"
                unelevated
                to="/checkout/"
                :disable="selectedItems.length === 0"
              />

              <!-- Информация о стоимости -->
              <div class="column q-gutter-y-sm">
                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">Товары ({{ selectedItemsCount }})</div>
                  <div class="text-caption">{{ totalOriginalPrice }}₽</div>
                </div>

                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">Скидка</div>
                  <div class="text-caption text-green">-{{ totalDiscount }}₽</div>
                </div>

                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">Доставка</div>
                  <div class="text-caption">
                    <span v-if="deliveryPrice === 0" class="text-green">Бесплатно</span>
                    <span v-else>{{ deliveryPrice }}₽</span>
                  </div>
                </div>

                <q-separator />

                <div class="row items-center justify-between">
                  <div class="text-h6 text-weight-bold">Итого</div>
                  <div class="text-h5 text-weight-bold text-primary">{{ totalPrice }}₽</div>
                </div>

              </div>

<!--              &lt;!&ndash; Промокод &ndash;&gt;-->
<!--              <q-input-->
<!--                v-model="promoCode"-->
<!--                label="Промокод"-->
<!--                dense-->
<!--                outlined-->
<!--              >-->
<!--                <template v-slot:append>-->
<!--                  <q-btn-->
<!--                    flat-->
<!--                    dense-->
<!--                    label="Применить"-->
<!--                    color="primary"-->
<!--                    :disable="!promoCode"-->
<!--                  />-->
<!--                </template>-->
<!--              </q-input>-->
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import DemoProductsGrid from 'src/widgets/DemoProductsGrid/ui/DemoProductsGrid.vue';

export default {
  name: "CartPage",
  components: { DemoProductsGrid },
  data() {
    return {
      selectAll: false,
      selectedItems: [],
      promoCode: '',
      cartItems: [
        {
          id: 1,
          name: "Футболка темно-синяя однотонная",
          description: "Размер: M, Цвет: синий",
          image: "https://cdn.quasar.dev/img/parallax2.jpg",
          originalPrice: 350,
          finalPrice: 300,
          discount: 10,
          quantity: 2
        },
        {
          id: 2,
          name: "Джинсы классические",
          description: "Размер: 32, Цвет: синий",
          image: "https://cdn.quasar.dev/img/parallax1.jpg",
          originalPrice: 2500,
          finalPrice: 2500,
          discount: 0,
          quantity: 1
        },
        {
          id: 3,
          name: "Худи оверсайз",
          description: "Размер: L, Цвет: черный",
          image: "https://cdn.quasar.dev/img/mountains.jpg",
          originalPrice: 1800,
          finalPrice: 1500,
          discount: 15,
          quantity: 1
        }
      ]
    }
  },
  computed: {
    selectedItemsCount() {
      return this.selectedItems.length;
    },
    totalOriginalPrice() {
      return this.cartItems
        .filter(item => this.selectedItems.includes(item.id))
        .reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    },
    totalFinalPrice() {
      return this.cartItems
        .filter(item => this.selectedItems.includes(item.id))
        .reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    },
    totalDiscount() {
      return this.totalOriginalPrice - this.totalFinalPrice;
    },
    deliveryPrice() {
      return this.totalFinalPrice > 2000 ? 0 : 300;
    },
    totalPrice() {
      return this.totalFinalPrice + this.deliveryPrice;
    }
  },
  watch: {
    selectAll(val) {
      if (val) {
        this.selectedItems = this.cartItems.map(item => item.id);
      } else {
        this.selectedItems = [];
      }
    },
    selectedItems(val) {
      this.selectAll = val.length === this.cartItems.length && this.cartItems.length > 0;
    }
  },
  methods: {
    increaseQuantity(itemId) {
      const item = this.cartItems.find(item => item.id === itemId);
      if (item) item.quantity++;
    },
    decreaseQuantity(itemId) {
      const item = this.cartItems.find(item => item.id === itemId);
      if (item && item.quantity > 1) item.quantity--;
    },
    removeItem(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.selectedItems = this.selectedItems.filter(id => id !== itemId);
    }
  }
}
</script>
