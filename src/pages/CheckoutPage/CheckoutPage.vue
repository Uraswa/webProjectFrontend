<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-xl">
      <q-breadcrumbs-el label="Главная" icon="home" to="/"/>
      <q-breadcrumbs-el label="Корзина" to="/cart"/>
      <q-breadcrumbs-el label="Оформление заказа"/>
    </q-breadcrumbs>

    <div class="text-h4 text-weight-bold q-mb-lg">Оформление заказа</div>

    <div v-if="cartItems.length === 0" class="text-center q-py-xl">
      <q-icon name="shopping_cart" size="100px" color="grey-5"/>
      <div class="text-h5 text-weight-medium q-mt-md text-grey-7">Ваша корзина пуста</div>
      <div class="text-grey-6 q-mt-sm">Добавьте товары из каталога</div>
      <q-btn label="Перейти в каталог" color="primary" to="/catalog" class="q-mt-lg"/>
    </div>

    <div v-else class="row q-col-gutter-xl">
      <!-- Левая колонка - информация о заказе -->
      <div class="col-md-8 col-12">
        <!-- Блок доставки -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Доставка</div>

            <div v-if="selectedOpp && selectedOpp.opp_id" class="row items-center justify-between">
              <div>
                <div class="text-weight-medium">Пункт выдачи заказов</div>
                <div class="text-caption text-grey-7">{{ selectedOpp.address }}</div>
                <div class="text-caption text-grey-7">
                  {{ selectedOpp.formattedWorkTime || 'Время работы не указано' }}
                </div>
              </div>
              <q-btn
                label="Изменить ПВЗ"
                color="primary"
                outline
                @click="$refs.oppSelector.open()"
              />
            </div>

            <div v-else class="text-center q-py-md">
              <div class="text-grey-6 q-mb-sm">Не выбран пункт выдачи</div>
              <q-btn
                label="Выбрать ПВЗ"
                color="primary"
                outline
                @click="$refs.oppSelector.open()"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Блок товаров -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Товары в заказе</div>

            <div class="column q-gutter-y-md">
              <q-item
                v-for="item in cartItems"
                :key="item.id"
                class="q-pa-none cart-item"
              >
                <q-item-section avatar>
                  <router-link :to="`/product/${item.product_id}`" style="text-decoration: none;">
                    <q-img
                      :src="item.image"
                      width="80px"
                      height="80px"
                      class="rounded-borders"
                      :ratio="1"
                    />
                  </router-link>
                </q-item-section>

                <q-item-section>
                  <router-link :to="`/product/${item.product.product_id}`"
                               style="text-decoration: none; color: inherit;">
                    <q-item-label class="text-weight-medium cursor-pointer">
                      {{ item.product.name }}
                    </q-item-label>
                  </router-link>
                  <q-item-label caption lines="2">{{ item.product.description }}</q-item-label>
                  <q-item-label caption class="text-grey-6">
                    Магазин: {{ item.product.shop_name }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="column items-end q-gutter-y-xs">
                    <div class="text-h6 text-weight-bold text-primary">
                      {{ (item.product.price * item.quantity).toFixed(2) }}₽
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ item.product.price }}₽ × {{ item.quantity }} шт.
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Правая колонка - итоги -->
      <div class="col-md-4 col-12" :class="$q.screen.lt.md ? 'order-first' : ''">
        <q-card flat bordered style="position: sticky; top: 20px;">
          <q-card-section>
            <div class="column q-gutter-y-md">
              <!-- Кнопка оформления -->
              <q-btn
                label="Оформить заказ"
                color="primary"
                size="lg"
                icon="shopping_cart"
                class="full-width"
                unelevated
                @click="createOrder"
                :disable="!selectedOpp"
                :loading="loading"
              />

              <!-- Информация о стоимости -->
              <div class="column q-gutter-y-sm">
                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">Товары ({{ cartItems.length }})</div>
                  <div class="text-caption">{{ totalPrice.toFixed(2) }}₽</div>
                </div>

                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">Доставка</div>
                  <div class="text-caption text-green">Бесплатно</div>
                </div>

                <q-separator/>

                <div class="row items-center justify-between">
                  <div class="text-h6 text-weight-bold">Итого к оплате</div>
                  <div class="text-h5 text-weight-bold text-primary">{{ totalPrice.toFixed(2) }}₽</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <OppSelector ref="oppSelector" @opp_selected="handleOppSelected"/>

  </q-page>
</template>

<script>

import Api from "src/shared/api/Api.js";
import OppSelector from "pages/CheckoutPage/OppSelector.vue";
import {cartApi} from "src/features/cart/api/cartApi.js";

export default {
  name: "CheckoutPage",
  components: {OppSelector},
  data() {
    return {
      oppList: [],
      cartItems: [],
      selectedOpp: null,
      loading: false,
      totalPrice: 0
    }
  },
  async mounted() {
    this.loading = true;
    await this.fetchCart();
    this.loading = false;
  },
  methods: {
    async fetchCart() {
      try {
        let cardItems = (await cartApi.getCart()).items;
        console.log(cardItems)

        this.cartItems = cardItems;

        this.calculateTotalPrice();
      } catch (e) {

      }
    },
    calculateTotalPrice() {
      this.totalPrice = this.cartItems.reduce((sum, item) => {
        return sum + (Number.parseFloat(item.total));
      }, 0);
    },
    handleOppSelected(opp) {
      this.selectedOpp = opp;
      console.log('Selected OPP:', opp);
    },
    async createOrder() {
      if (!this.selectedOpp || !this.selectedOpp.opp_id) {

        return;
      }

      // Здесь будет логика создания заказа
      console.log('Creating order with OPP:', this.selectedOpp);
      try {
        let response = await Api.post('/api/orders/create', {opp_id: this.selectedOpp.opp_id})
        if (response.data.success) {
           this.$router.push("/orderMade/")
        } else {
          if (response.data.error === 'products_count_changed') {
            alert("Пришлось изменить количество некоторых товаров в корзине, поскольку изначальное кол-во больше недоступно на складе");
            this.cartItems = response.data.data.cart.items;

            this.calculateTotalPrice();
          }
        }


      } catch (e) {
          alert("Ошибка")
      }

    }
  }
}

</script>

<style scoped>
.cart-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
}

.border-primary {
  border: 2px solid #1976d2 !important;
}
</style>
