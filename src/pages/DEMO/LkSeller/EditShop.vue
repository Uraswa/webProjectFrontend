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
import Api from "src/shared/api/Api.js"

export default {
  name: 'EditShopPage',

  data () {
    return {
      loading: false,
      shopId: null,
      form: {
        name: '',
        description: ''
      }
    }
  },

  mounted () {
    this.shopId = this.$route.params.id
    this.fetchShop()
  },

  methods: {
    async fetchShop () {
      try {
        this.loading = true

        const { data } = await Api.get(`/shops/${this.shopId}`)

        this.form.name = data.name
        this.form.description = data.description

      } catch (error) {
        console.error('Ошибка получения магазина:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Не удалось загрузить магазин'
        })
      } finally {
        this.loading = false
      }
    },

    async save () {
      try {
        this.loading = true

        await Api.put(`/shops/${this.shopId}`, {
          name: this.form.name,
          description: this.form.description
        })

        this.$q.notify({
          type: 'positive',
          message: 'Магазин успешно обновлён'
        })

      } catch (error) {
        console.error('Ошибка сохранения магазина:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при сохранении'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
