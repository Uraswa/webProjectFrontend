<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-xl">
      <q-breadcrumbs-el label="Главная" icon="home" to="/" />
      <q-breadcrumbs-el label="Корзина" to="/cart" />
      <q-breadcrumbs-el label="Оформление заказа" />
    </q-breadcrumbs>

    <div class="text-h4 text-weight-bold q-mb-lg">Оформление заказа</div>

    <div v-if="cartItems.length === 0" class="text-center q-py-xl">
      <q-icon name="shopping_cart" size="100px" color="grey-5" />
      <div class="text-h5 text-weight-medium q-mt-md text-grey-7">Ваша корзина пуста</div>
      <div class="text-grey-6 q-mt-sm">Добавьте товары из каталога</div>
      <q-btn label="Перейти в каталог" color="primary" to="/catalog" class="q-mt-lg" />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <!-- Левая колонка - информация о заказе -->
      <div class="col-md-8 col-12">
        <!-- Блок доставки -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Доставка</div>

            <div v-if="selectedOpp" class="row items-center justify-between">
              <div>
                <div class="text-weight-medium">Пункт выдачи заказов</div>
                <div class="text-caption text-grey-7">{{ selectedOpp.address }}</div>
                <div class="text-caption text-grey-7">
                  {{ formatWorkTime(selectedOpp.workTime) }}
                </div>
              </div>
              <q-btn
                label="Изменить ПВЗ"
                color="primary"
                outline
                @click="showPvzModal = true"
              />
            </div>

            <div v-else class="text-center q-py-md">
              <div class="text-grey-6 q-mb-sm">Не выбран пункт выдачи</div>
              <q-btn
                label="Выбрать ПВЗ"
                color="primary"
                outline
                @click="showPvzModal = true"
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
                  <router-link :to="`/product/${item.product_id}`" style="text-decoration: none; color: inherit;">
                    <q-item-label class="text-weight-medium cursor-pointer">
                      {{ item.name }}
                    </q-item-label>
                  </router-link>
                  <q-item-label caption lines="2">{{ item.description }}</q-item-label>
                  <q-item-label caption class="text-grey-6">
                    Магазин: {{ item.product.shop_name }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="column items-end q-gutter-y-xs">
                    <div class="text-h6 text-weight-bold text-primary">
                      {{ (item.price * item.quantity).toFixed(2) }}₽
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ item.price.toFixed(2) }}₽ × {{ item.quantity }} шт.
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

                <q-separator />

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

    <!-- Модалка выбора ПВЗ -->
    <q-dialog v-model="showPvzModal" full-width full-height>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Выбор пункта выдачи заказов</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row" style="height: 70vh">
            <!-- Левая колонка - список ПВЗ -->
            <div class="col-4">
              <q-scroll-area style="height: 70vh">
                <div class="column q-gutter-y-md">
                  <q-card
                    v-for="opp in oppList"
                    :key="opp.opp_id"
                    bordered
                    :class="{ 'border-primary': selectedOpp?.opp_id === opp.opp_id }"
                  >
                    <q-card-section>
                      <div class="text-weight-medium">{{ opp.address }}</div>
                      <div class="text-caption text-grey-7 q-mb-sm">
                        {{ formatWorkTime(opp.workTime) }}
                      </div>
                      <q-btn
                        label="Выбрать"
                        color="primary"
                        size="sm"
                        outline
                        class="full-width"
                        @click="selectOpp(opp)"
                      />
                    </q-card-section>
                  </q-card>
                </div>
              </q-scroll-area>
            </div>

            <!-- Правая колонка - карта -->
            <div class="col-8">
              <q-card bordered class="full-height">
                <q-card-section>
                  <div class="text-weight-medium q-mb-md">Выберите пункт выдачи на карте</div>

                  <!-- Заглушка для карты -->
                  <div class="full-height flex flex-center bg-grey-3 rounded-borders">
                    <div class="text-center">
                      <q-icon name="map" size="xl" color="grey-6" class="q-mb-sm" />
                      <div class="text-h6 text-grey-6">Карта</div>
                      <div class="text-caption text-grey-6">Здесь будет виджет карты</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from 'src/features/cart/model/useCart';
import { parseProductPhotos } from 'src/shared/utils/parsePhotos';
import Api from 'src/shared/api/Api';
import { Notify } from 'quasar';

const router = useRouter();
const { cart, fetchCart } = useCart();

const loading = ref(false);
const showPvzModal = ref(false);
const selectedOpp = ref<any>(null);
const oppList = ref<any[]>([]);

// Берем товары из корзины
const cartItems = computed(() => {
  if (!cart.value) return [];
  return cart.value.items.map(item => ({
    id: item.product_id,
    product_id: item.product_id,
    name: item.product.name,
    description: item.product.description,
    image: parseProductPhotos(item.product.photos)[0] || 'https://cdn.quasar.dev/img/parallax2.jpg',
    price: parseFloat(item.product.price),
    quantity: item.quantity,
    product: item.product
  }));
});

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// Загружаем список ПВЗ
async function loadOppList() {
  try {
    const response = await Api.get('/api/admin/opp/list');
    oppList.value = response.data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки ПВЗ:', error);
    // Заглушка на случай ошибки
    oppList.value = [
      {
        opp_id: 1,
        address: "г. Пермь, ул. Уинская, 12",
        workTime: '{"mon": "09:00-21:00", "tue": "09:00-21:00", "wed": "09:00-21:00", "thu": "09:00-21:00", "fri": "09:00-21:00", "sat": "09:00-21:00", "sun": "09:00-21:00"}'
      },
      {
        opp_id: 2,
        address: "г. Пермь, ул. Ленина, 45",
        workTime: '{"mon": "10:00-20:00", "tue": "10:00-20:00", "wed": "10:00-20:00", "thu": "10:00-20:00", "fri": "10:00-20:00", "sat": "10:00-18:00", "sun": "10:00-18:00"}'
      }
    ];
  }
}

function selectOpp(opp: any) {
  selectedOpp.value = opp;
  showPvzModal.value = false;
}

function formatWorkTime(workTime: string): string {
  try {
    const parsed = JSON.parse(workTime);
    return 'Ежедневно с 09:00 до 21:00';
  } catch {
    return 'Ежедневно с 09:00 до 21:00';
  }
}

async function createOrder() {
  if (!selectedOpp.value) {
    Notify.create({
      message: 'Выберите пункт выдачи заказа',
      color: 'warning',
      position: 'top'
    });
    return;
  }

  try {
    loading.value = true;
    
    // Отправляем запрос на создание заказа
    const response = await Api.post('/api/orders/create', {
      opp_id: selectedOpp.value.opp_id
    });

    if (response.data.success) {
      // Редирект на страницу успешного оформления
      router.push(`/orderMade/?orderId=${response.data.data.order_id}`);
    } else {
      throw new Error(response.data.error || 'Ошибка создания заказа');
    }
    
  } catch (error: any) {
    console.error('Ошибка создания заказа:', error);
    
    Notify.create({
      message: error.response?.data?.error || 'Не удалось оформить заказ',
      color: 'negative',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchCart();
  await loadOppList();
});
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