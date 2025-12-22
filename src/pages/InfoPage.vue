<template>
  <q-page class="info-page q-pa-xl">
    <div class="container" style="max-width: 1000px; margin: 0 auto;">
      
      <!-- Заголовок страницы -->
      <div class="text-center q-mb-xl">
        <h1 class="text-h3 text-weight-bold q-mb-md">Информация</h1>
      </div>

      <!-- Контент секций -->
      <div class="sections">
        
        <!-- FAQ -->
        <section id="faq" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Вопросы и ответы</h2>
          
          <div class="q-gutter-y-md">
            <div v-for="item in faqItems" :key="item.question">
              <div class="text-weight-medium q-mb-xs">{{ item.question }}</div>
              <p class="text-body2 text-grey-8 q-mb-sm">{{ item.answer }}</p>
              <q-separator />
            </div>
          </div>
        </section>

        <!-- Доставка -->
        <section id="delivery" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Заказы и доставка</h2>
          
          <div class="q-gutter-y-md">
            <div>
              <div class="text-weight-medium">Как сделать заказ?</div>
              <p class="text-body2 text-grey-8">Добавьте товары в корзину, выберите ПВЗ и оформите заказ.</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Способы доставки</div>
              <p class="text-body2 text-grey-8">Только самовывоз из пунктов выдачи заказов (ПВЗ).</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Стоимость доставки</div>
              <p class="text-body2 text-grey-8">Бесплатно. Вы платите только за товар.</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Сроки доставки</div>
              <p class="text-body2 text-grey-8">1-3 дня до выбранного ПВЗ. Статус отслеживается в личном кабинете.</p>
            </div>
          </div>
        </section>

        <!-- Возврат -->
        <section id="returns" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Возврат товаров</h2>
          
          <div class="q-gutter-y-md">
            <div>
              <div class="text-weight-medium">Условия возврата</div>
              <p class="text-body2 text-grey-8">Товар можно вернуть в течение 14 дней с момента получения, если он не был в употреблении.</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Процесс возврата</div>
              <p class="text-body2 text-grey-8">1. Подайте заявку в личном кабинете<br>
                 2. Отнесите товар в тот же ПВЗ<br>
                 3. Получите деньги при следующем посещении</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Возврат денег</div>
              <p class="text-body2 text-grey-8">Наличными в ПВЗ при получении возврата.</p>
            </div>
          </div>
        </section>

        <!-- Оплата -->
        <section id="payment" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Оплата</h2>
          
          <div class="q-gutter-y-md">
            <div>
              <div class="text-weight-medium">Способы оплаты</div>
              <p class="text-body2 text-grey-8">Наличными при получении заказа в ПВЗ.</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Когда платить?</div>
              <p class="text-body2 text-grey-8">Только при получении товара в пункте выдачи.</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Предоплата</div>
              <p class="text-body2 text-grey-8">Не требуется. Оплачивайте только то, что забираете.</p>
            </div>
          </div>
        </section>

        <!-- Контакты -->
        <section id="contacts" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Контакты</h2>
          
          <div class="q-gutter-y-md">
            <div>
              <div class="text-weight-medium">Телефон</div>
              <p class="text-body2 text-grey-8">+7 (999) 123-45-67</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Email</div>
              <p class="text-body2 text-grey-8">info@sellzy.ru</p>
            </div>
            
            <div>
              <div class="text-weight-medium">Время работы</div>
              <p class="text-body2 text-grey-8">Пн-Пт: 9:00-18:00</p>
            </div>
          </div>
        </section>

        <!-- Соцсети -->
        <section id="social" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Социальные сети</h2>
          
          <div class="q-gutter-md">
            <a 
              href="https://vk.com/sellzy!" 
              target="_blank"
              class="text-primary text-no-underline"
            >
              <q-icon name="fab fa-vk" class="q-mr-xs" />
              ВКонтакте
            </a>
            
            <br>
            
            <a 
              href="https://t.me/sellzy" 
              target="_blank"
              class="text-primary text-no-underline"
            >
              <q-icon name="fab fa-telegram" class="q-mr-xs" />
              Telegram
            </a>
          </div>
        </section>

        <!-- Сотрудничество -->
        <section id="cooperation" class="section q-mb-lg">
          <h2 class="text-h5 text-weight-bold q-mb-md">Сотрудничество</h2>
          
          <p class="text-body2 text-grey-8">
            Если вы хотите стать продавцом на нашей площадке, пишите на email: 
            <strong>partners@sellzy.ru</strong>
          </p>
        </section>

      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'InfoPage',
  
  data() {
    return {
      faqItems: [
        {
          question: 'Как оформить заказ?',
          answer: 'Выберите товары, добавьте их в корзину, выберите ПВЗ и оформите заказ. Оплата при получении.'
        },
        {
          question: 'Как отследить заказ?',
          answer: 'Статус заказа можно увидеть в личном кабинете в разделе "Мои заказы".'
        },
        {
          question: 'Что такое ПВЗ?',
          answer: 'Пункт выдачи заказов - место, где вы можете забрать свой заказ.'
        },
        {
          question: 'Можно ли изменить ПВЗ после оформления заказа?',
          answer: 'Нет, после оформления заказа изменить ПВЗ нельзя. Придется отменить заказ и создать новый.'
        }
      ]
    }
  },
  
  mounted() {
    // Обрабатываем hash при загрузке страницы
    this.handleHashOnLoad()
    
    // Добавляем обработчик hashchange
    window.addEventListener('hashchange', this.handleHashChange)
  },
  
  beforeDestroy() {
    window.removeEventListener('hashchange', this.handleHashChange)
  },
  
  methods: {
    handleHashOnLoad() {
      const hash = window.location.hash.substring(1) // Убираем #
      if (hash) {
        setTimeout(() => {
          this.scrollToTab(hash)
        }, 300) // Даем время на рендеринг
      }
    },
    
    handleHashChange() {
      const hash = window.location.hash.substring(1)
      if (hash) {
        this.scrollToTab(hash)
      }
    },
    
    scrollToTab(tabId) {
      this.$nextTick(() => {
        const element = document.getElementById(tabId)
        if (element) {
          // Обновляем URL hash
          window.location.hash = tabId
          
          // Прокручиваем к элементу с отступом для фиксированного header
          const yOffset = -70 // Отступ для фиксированного header
          const y = element.getBoundingClientRect().top + 
                    window.pageYOffset + 
                    yOffset
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.info-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 100px); /* Учитываем высоту футера */
}

.section {
  padding: 24px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
  scroll-margin-top: 80px; /* Отступ для якорных ссылок с учетом фиксированного header */
}

.text-no-underline {
  text-decoration: none;
}
</style>