<template>
  <q-page class="info-page">
    <div class="page-container">
      
      <!-- Заголовок страницы -->
      <div class="page-header">
        <h1 class="page-title">Информация</h1>
      </div>

      <!-- Контейнер для секций - вертикальный список -->
      <div class="sections-list">
        
        <!-- FAQ -->
        <section id="faq" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Вопросы и ответы</h2>
          </div>
          <div class="section-content">
            <div v-for="item in faqItems" :key="item.question" class="faq-item">
              <div class="question">{{ item.question }}</div>
              <p class="answer">{{ item.answer }}</p>
              <q-separator />
            </div>
          </div>
        </section>

        <!-- Доставка -->
        <section id="delivery" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Заказы и доставка</h2>
          </div>
          <div class="section-content">
            <div class="info-item">
              <div class="info-label">Как сделать заказ?</div>
              <p class="info-text">Добавьте товары в корзину, выберите ПВЗ и оформите заказ.</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Способы доставки</div>
              <p class="info-text">Только самовывоз из пунктов выдачи заказов (ПВЗ).</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Стоимость доставки</div>
              <p class="info-text">Бесплатно. Вы платите только за товар.</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Сроки доставки</div>
              <p class="info-text">1-3 дня до выбранного ПВЗ. Статус отслеживается в личном кабинете.</p>
            </div>
          </div>
        </section>

        <!-- Возврат -->
        <section id="returns" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Возврат товаров</h2>
          </div>
          <div class="section-content">
            <div class="info-item">
              <div class="info-label">Условия возврата</div>
              <p class="info-text">Товар можно вернуть в течение 14 дней с момента получения, если он не был в употреблении.</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Процесс возврата</div>
              <p class="info-text">1. Подайте заявку в личном кабинете<br>
                 2. Отнесите товар в тот же ПВЗ<br>
                 3. Получите деньги при следующем посещении</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Возврат денег</div>
              <p class="info-text">Наличными в ПВЗ при получении возврата.</p>
            </div>
          </div>
        </section>

        <!-- Оплата -->
        <section id="payment" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Оплата</h2>
          </div>
          <div class="section-content">
            <div class="info-item">
              <div class="info-label">Способы оплаты</div>
              <p class="info-text">Наличными при получении заказа в ПВЗ.</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Когда платить?</div>
              <p class="info-text">Только при получении товара в пункте выдачи.</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Предоплата</div>
              <p class="info-text">Не требуется. Оплачивайте только то, что забираете.</p>
            </div>
          </div>
        </section>

        <!-- Контакты -->
        <section id="contacts" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Контакты</h2>
          </div>
          <div class="section-content">
            <div class="info-item">
              <div class="info-label">Телефон</div>
              <p class="info-text">+7 (999) 123-45-67</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Email</div>
              <p class="info-text">info@sellzy.ru</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">Время работы</div>
              <p class="info-text">Пн-Пт: 9:00-18:00</p>
            </div>
          </div>
        </section>

        <!-- Соцсети -->
        <section id="social" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Социальные сети</h2>
          </div>
          <div class="section-content">
            <div class="social-links">
              <a 
                href="https://vk.com/sellzy!" 
                target="_blank"
                class="social-link"
              >
                <q-icon name="fab fa-vk" class="social-icon" />
                ВКонтакте
              </a>
              
              <a 
                href="https://t.me/sellzy" 
                target="_blank"
                class="social-link"
              >
                <q-icon name="fab fa-telegram" class="social-icon" />
                Telegram
              </a>
            </div>
          </div>
        </section>

        <!-- Сотрудничество -->
        <section id="cooperation" class="info-section">
          <div class="section-header">
            <h2 class="section-title">Сотрудничество</h2>
          </div>
          <div class="section-content">
            <p class="info-text">
              Если вы хотите стать продавцом на нашей площадке, пишите на email: 
              <strong>partners@sellzy.ru</strong>
            </p>
          </div>
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
    this.handleHashOnLoad()
    window.addEventListener('hashchange', this.handleHashChange)
  },
  
  beforeDestroy() {
    window.removeEventListener('hashchange', this.handleHashChange)
  },
  
  methods: {
    handleHashOnLoad() {
      const hash = window.location.hash.substring(1)
      if (hash) {
        setTimeout(() => {
          this.scrollToTab(hash)
        }, 300)
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
          window.location.hash = tabId
          
          // Адаптивный отступ в зависимости от размера экрана
          const yOffset = window.innerWidth < 768 ? -60 : -80
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
/* Базовые стили для всех устройств */
.info-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 100px);
  padding: 16px;
}

.page-container {
  max-width: 1000px; /* Фиксированная максимальная ширина */
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  padding: 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a237e;
  text-align: center;
}

/* Вертикальный список секций */
.sections-list {
  display: flex;
  flex-direction: column;
  gap: 24px; /* Отступ между секциями */
}

/* Карточка секции */
.info-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  scroll-margin-top: 70px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.section-header {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.section-content {
  padding: 24px;
}

/* Элементы FAQ */
.faq-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.faq-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
}

.question {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.answer {
  font-size: 1rem;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.6;
}

/* Элементы информации */
.info-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.info-text {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

/* Социальные ссылки */
.social-links {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  color: #1976d2;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px 20px;
  background-color: #f5f9ff;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.social-link:hover {
  color: #1565c0;
  background-color: #e3f2fd;
  text-decoration: none;
  transform: translateY(-1px);
}

.social-icon {
  margin-right: 10px;
  font-size: 1.3rem;
}

/* ===== АДАПТИВНОСТЬ ===== */

/* Планшеты (768px-1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .info-page {
    padding: 24px;
  }
  
  .page-title {
    font-size: 2.25rem;
  }
  
  .sections-list {
    gap: 28px;
  }
  
  .section-header {
    padding: 24px 28px;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .section-content {
    padding: 28px;
  }
  
  .question, .info-label {
    font-size: 1.15rem;
  }
}

/* Десктоп (≥1024px) */
@media (min-width: 1024px) {
  .info-page {
    padding: 32px 40px;
  }
  
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }
  
  .sections-list {
    gap: 32px;
  }
  
  .section-header {
    padding: 28px 32px;
  }
  
  .section-title {
    font-size: 1.7rem;
  }
  
  .section-content {
    padding: 32px;
  }
  
  .faq-item, .info-item {
    margin-bottom: 24px;
    padding-bottom: 24px;
  }
  
  .question, .info-label {
    font-size: 1.2rem;
  }
  
  .answer, .info-text {
    font-size: 1.05rem;
  }
  
  .social-link {
    padding: 14px 24px;
    font-size: 1.15rem;
  }
  
  .social-links {
    gap: 32px;
  }
}

/* Мобильные (<768px) */
@media (max-width: 767px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .sections-list {
    gap: 20px;
  }
  
  .section-header {
    padding: 16px 20px;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .section-content {
    padding: 20px;
  }
  
  .faq-item, .info-item {
    margin-bottom: 16px;
    padding-bottom: 16px;
  }
  
  .question, .info-label {
    font-size: 1rem;
  }
  
  .answer, .info-text {
    font-size: 0.95rem;
  }
  
  .social-links {
    flex-direction: column;
    gap: 12px;
  }
  
  .social-link {
    width: 100%;
    justify-content: center;
  }
  
  /* Уменьшаем скролл-отступ для мобильных */
  .info-section {
    scroll-margin-top: 60px;
  }
}

/* Очень маленькие экраны (<480px) */
@media (max-width: 480px) {
  .info-page {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .sections-list {
    gap: 16px;
  }
  
  .section-header {
    padding: 14px 16px;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .section-content {
    padding: 16px;
  }
  
  .faq-item, .info-item {
    margin-bottom: 14px;
    padding-bottom: 14px;
  }
}

/* Горизонтальные телефоны (высота < 600px) */
@media (max-height: 600px) and (orientation: landscape) {
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
  
  .sections-list {
    gap: 16px;
  }
  
  .section-header {
    padding: 12px 16px;
  }
  
  .section-content {
    padding: 16px;
  }
  
  .faq-item, .info-item {
    margin-bottom: 12px;
    padding-bottom: 12px;
  }
}

/* Эффект для секций при наведении (только на устройствах с мышью) */
@media (hover: hover) and (pointer: fine) {
  .info-section:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .social-link:hover {
    transform: translateY(-2px);
  }
}

/* Отключение эффектов hover на сенсорных устройствах */
@media (hover: none) and (pointer: coarse) {
  .info-section {
    transition: none;
  }
  
  .social-link {
    transition: none;
  }
}
</style>