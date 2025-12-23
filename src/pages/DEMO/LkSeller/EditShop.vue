<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Мои магазины</div>
        <div class="text-caption text-grey-7">Управление магазинами продавца</div>
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="searchQuery"
              placeholder="Поиск по названию"
              dense
              outlined
              clearable
              debounce="400"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              label="Обновить"
              color="primary"
              outline
              class="full-width"
              @click="fetchShops"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-table
        :rows="filteredShops"
        :columns="columns"
        row-key="shop_id"
        :loading="loading"
        flat
        bordered
        rows-per-page-label="Записей на странице"
        :rows-per-page-options="[5, 10, 20, 50]"
        :pagination-label="paginationLabel"
        no-data-label="Магазины не найдены"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs justify-end">
              <q-btn
                icon="edit"
                size="sm"
                color="primary"
                dense
                flat
                @click="editShop(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="editDialog" @hide="resetForm">
      <q-card style="min-width: 520px">
        <q-card-section>
          <div class="text-h6">Редактировать магазин</div>
        </q-card-section>

        <q-form @submit.prevent="save">
          <q-card-section class="q-gutter-sm">
            <q-input
              v-model="form.name"
              label="Название магазина"
              dense
              outlined
              required
            />
            <q-input
              v-model="form.description"
              label="Описание магазина"
              type="textarea"
              dense
              outlined
              autogrow
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn
              label="Сохранить"
              color="primary"
              type="submit"
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
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
      saving: false,
      searchQuery: '',
      editDialog: false,
      form: { name: '', description: '' },
      currentShopId: null,
      columns: [
        { name: 'shop_id', label: 'ID', field: 'shop_id', align: 'left', sortable: true },
        { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
        {
          name: 'description',
          label: 'Описание',
          field: row => row.description || '-',
          align: 'left',
          sortable: false
        },
        { name: 'actions', label: 'Действия', field: 'actions', align: 'right', sortable: false }
      ]
    }
  },

  mounted () {
    this.fetchShops()
  },

  computed: {
    filteredShops() {
      const search = String(this.searchQuery || '').trim().toLowerCase();
      if (!search) return this.shops;
      return (this.shops || []).filter((shop) =>
        String(shop?.name || '').toLowerCase().includes(search)
      );
    }
  },

  methods: {
    paginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex}-${endRowIndex} из ${totalRowsNumber}`;
    },
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

    resetForm() {
      this.form = { name: '', description: '' }
      this.currentShopId = null
    },

    async save () {
      try {
        this.saving = true
        await Api.put(`/api/shops/${this.currentShopId}`, this.form)
        Notify.create({ type: 'positive', message: 'Магазин успешно обновлён' })
        this.editDialog = false
        this.fetchShops()
      } catch (error) {
        console.error('Ошибка сохранения магазина:', error)
        Notify.create({ type: 'negative', message: 'Ошибка при сохранении' })
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
