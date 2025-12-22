<template>
  <div class="q-pa-lg">

    <div class="text-h4 text-weight-bold q-mb-md">
      Мои магазины
    </div>

    <div v-if="loading">Загрузка...</div>

    <div v-else>
      <q-card v-for="shop in shops" :key="shop.shop_id" class="q-mb-md" flat bordered>
        <q-card-section>
          <div class="text-h6">{{ shop.name }}</div>
          <div class="text-caption text-grey-7">{{ shop.description }}</div>
          <div class="row justify-end q-mt-sm">
            <q-btn label="Редактировать" color="primary" @click="editShop(shop)" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="editDialog">
      <q-card>
        <q-card-section>
          <q-form @submit.prevent="save">
            <q-input v-model="form.name" label="Название магазина" outlined dense required />
            <q-input v-model="form.description" label="Описание магазина" type="textarea" outlined dense />
            <div class="row justify-end q-mt-md">
              <q-btn label="Сохранить" color="primary" type="submit" :loading="loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import Api from "src/shared/api/Api.js"
import { Notify } from "quasar";

export default {
  name: 'SellerShopsPage',

  data () {
    return {
      shops: [],
      loading: false,
      editDialog: false,
      form: { name: '', description: '' },
      currentShopId: null
    }
  },

  mounted () {
    this.fetchShops()
  },

  methods: {
    async fetchShops () {
      try {
        this.loading = true
        const { data } = await Api.get('/api/shops')
        this.shops = Array.isArray(data) ? data : (data?.shops || [])
      } catch (error) {
        console.error('Ошибка получения магазинов:', error)
        Notify.create({ type: 'negative', message: 'Не удалось загрузить магазины' })
      } finally {
        this.loading = false
      }
    },

    editShop (shop) {
      this.currentShopId = shop.shop_id
      this.form.name = shop.name
      this.form.description = shop.description
      this.editDialog = true
    },

    async save () {
      try {
        this.loading = true
        await Api.put(`/api/shops/${this.currentShopId}`, this.form)
        Notify.create({ type: 'positive', message: 'Магазин успешно обновлён' })
        this.editDialog = false
        this.fetchShops()
      } catch (error) {
        console.error('Ошибка сохранения магазина:', error)
        Notify.create({ type: 'negative', message: 'Ошибка при сохранении' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
