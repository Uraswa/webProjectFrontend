<template>
  <div class="footer q-pa-md" style="background-color: white;">
    <div class="row" style="margin-top: 50px; margin-bottom: 100px">
      <div class="col-lg-3 col-md-6 col-12" style="display: flex; flex-direction: column; justify-content: space-between; padding-right: 50px">
        <p style="margin: 0; font-size: 2em">Sellzy</p>
        <p style="font-size: 12px; color: grey">
          Подпишись, чтобы первым быть в курсе новых акций и скидок на нашей площадке!
        </p>
        <p style="font-size: 14px;">© 2025 Sellzy</p>
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <h6 style="margin-bottom: 10px;margin-top: 0;">Покупателям</h6>
        
        <a @click="navigateToTab('faq')" class="footer-link" style="cursor: pointer;">
          Вопросы и ответы
        </a>
        
        <a @click="navigateToTab('delivery')" class="footer-link" style="cursor: pointer;">
          Заказы и доставка
        </a>
        
        <a @click="navigateToTab('returns')" class="footer-link" style="cursor: pointer;">
          Возврат товаров
        </a>
        
        <a @click="navigateToTab('payment')" class="footer-link" style="cursor: pointer;">
          Оплата
        </a>
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <h6 style="margin-bottom: 10px;margin-top: 0;">О нас</h6>
        
        <a @click="navigateToTab('contacts')" class="footer-link" style="cursor: pointer;">
          Контакты
        </a>
        
        <a @click="navigateToTab('social')" class="footer-link" style="cursor: pointer;">
          Социальные сети
        </a>
        
        <a @click="navigateToTab('cooperation')" class="footer-link" style="cursor: pointer;">
          Сотрудничество
        </a>
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <h6 style="margin-bottom: 10px;margin-top: 0;">Подписаться на новости</h6>
        <p style="font-size: 14px; color: grey">
          Подпишись, чтобы первым быть в курсе новых акций и скидок на нашей площадке!
        </p>
        <q-input label="Подписаться на новости">
          <template v-slot:after>
            <q-btn round dense flat icon="arrow_right"/>
          </template>
        </q-input>
        <q-checkbox v-model="xer">
          <span>Соглашаюсь с 
            <a href="http://google.com" target="_blank" style="color: black" @click.stop>
              Политикой конфидицеальности
            </a>
          </span>
        </q-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      xer: false
    }
  },
  methods: {
    navigateToTab(tabId) {
      // Если уже на странице info
      if (this.$route.name === 'info') {
        // Устанавливаем hash в URL
        window.location.hash = tabId
        
        // Ждем небольшое время для обновления URL, затем прокручиваем
        setTimeout(() => {
          this.scrollToElement(tabId)
        }, 50)
      } else {
        // Если на другой странице, переходим на info с hash
        this.$router.push({ 
          name: 'info', 
          hash: `#${tabId}`
        })
      }
    },
    
    scrollToElement(elementId) {
      const element = document.getElementById(elementId)
      if (element) {
        const yOffset = -70 // Отступ для фиксированного header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style scoped>
.footer {
  width: 100%;
}

.footer-link {
  display: block;
  font-size: 14px; 
  color: grey;
  margin-bottom: 8px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #1976d2;
  text-decoration: underline;
}
</style>