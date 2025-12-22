<template>
  <div class="q-pa-lg">

    <div class="text-h4 text-weight-bold q-mb-md">
      Редактирование магазина
    </div>

    <q-card flat bordered>
      <q-card-section>

        <q-form @submit.prevent="save">

          <q-input
            v-model="form.name"
            label="Название магазина"
            outlined
            dense
            class="q-mb-md"
            required
          />

          <q-input
            v-model="form.description"
            label="Описание магазина"
            type="textarea"
            outlined
            dense
            class="q-mb-md"
          />

          <div class="row justify-end">
            <q-btn
              label="Сохранить"
              color="primary"
              type="submit"
              :loading="loading"
            />
          </div>

        </q-form>

      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EditShopPage',

  data() {
    return {
      loading: false,
      form: {
        name: '',
        description: ''
      },
      shopId: null
    }
  },

  mounted() {
    // получаем shopId из маршрута
    this.shopId = this.$route.params.id
    this.fetchShop()
  },

  methods: {
    async fetchShop() {
      try {
        this.loading = true
        const response = await axios.get(`http://localhost:8000/shops/${this.shopId}`)
        this.form = response.data
      } catch (e) {
        console.error('Ошибка при получении магазина:', e)
      } finally {
        this.loading = false
      }
    },

    async save() {
      try {
        this.loading = true
        const response = await axios.put(`http://localhost:8000/shops/${this.shopId}`, this.form)
        this.form = response.data
        this.$q.notify({ type: 'positive', message: 'Магазин успешно обновлен!' })
      } catch (e) {
        console.error('Ошибка при сохранении магазина:', e)
        this.$q.notify({ type: 'negative', message: 'Ошибка при сохранении' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
