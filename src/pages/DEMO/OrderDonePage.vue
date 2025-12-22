<template>
  <q-page class="flex flex-center">
    <div class="column items-center text-center q-gutter-y-lg">
      <q-icon
        name="check_circle"
        color="positive"
        size="xl"
        style="font-size: 80px;"
      />

      <div class="text-h4 text-weight-bold">
        Ваш заказ оформлен!
      </div>


      <q-btn
        label="Вернуться в магазин"
        color="primary"
        size="lg"
        icon="shopping_cart"
        unelevated
        to="/"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "OrderDonePage"
}
</script>
