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
        <p style="font-size: 14px; color: grey">Вопросы и ответы</p>
        <p style="font-size: 14px; color: grey">Заказы и доставка</p>
        <p style="font-size: 14px; color: grey">Возврат товаров</p>
        <p style="font-size: 14px; color: grey">Оплата</p>
        <p style="font-size: 14px; color: grey">Акции и скидки</p>
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <h6 style="margin-bottom: 10px;margin-top: 0;">О нас</h6>
        <p style="font-size: 14px; color: grey">Контакты</p>
        <p style="font-size: 14px; color: grey">Социальные сети</p>
        <p style="font-size: 14px; color: grey">Сотрудничество</p>
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
  }
}
</script>

<style scoped>
.footer {
  width: 100%;
}
</style>