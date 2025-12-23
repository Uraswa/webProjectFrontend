<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Товары</div>
        <div class="text-caption text-grey-7">Управление товарами вашего магазина</div>
      </div>
      <q-btn
        label="Добавить товар"
        color="primary"
        icon="add"
        unelevated
        to="/seller/products/add"
      />
    </div>

        <!-- Фильтры и поиск -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="row items-center q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="searchQuery"
                  placeholder="Поиск по названию..."
                  dense
                  outlined
                  clearable
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="categoryFilter"
                  :options="categoryOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Категория"
                  dense
                  outlined
                  clearable
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="statusFilter"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Статус"
                  dense
                  outlined
                  clearable
                />
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  label="Применить"
                  color="primary"
                  class="full-width"
                  unelevated
                  @click="applyFilters"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Таблица товаров -->
        <q-card flat bordered>
          <q-table
            :rows="filteredProducts"
            :columns="columns"
            row-key="id"
            :loading="loading"
            flat
            bordered
            rows-per-page-label="Записей на странице"
            :rows-per-page-options="[5, 10, 20, 50]"
            :pagination-label="paginationLabel"
            no-data-label="Товары не найдены"
          >
            <!-- Колонка с фотографией -->
            <template v-slot:body-cell-photo="props">
              <q-td :props="props">
                <q-img
                  :src="props.row.photo"
                  width="50px"
                  height="50px"
                  class="rounded-borders"
                />
              </q-td>
            </template>

            <!-- Колонка с ценой -->
            <template v-slot:body-cell-price="props">
              <q-td :props="props">
                <div class="text-weight-bold text-primary">{{ props.row.price }}₽</div>
              </q-td>
            </template>

            <!-- Колонка со статусом -->
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.status === 'active' ? 'green' : 'orange'"
                  :label="props.row.status === 'active' ? 'Активен' : 'Неактивен'"
                />
              </q-td>
            </template>

            <!-- Колонка с действиями -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="row q-gutter-xs justify-end">
                  <q-btn
                    icon="edit"
                    size="sm"
                    color="primary"
                    dense
                    flat
                    :to="`/seller/products/edit/${props.row.id}`"
                  />
                  <q-btn
                    icon="delete"
                    size="sm"
                    color="negative"
                    dense
                    flat
                    @click="confirmDelete(props.row)"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card>

        <!-- Диалог подтверждения удаления -->
        <q-dialog v-model="deleteDialog">
          <q-card>
            <q-card-section>
              <div class="text-h6">Удаление товара</div>
            </q-card-section>

            <q-card-section>
              Вы уверены, что хотите удалить товар "{{ selectedProduct?.name }}"?
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Отмена" color="primary" v-close-popup />
              <q-btn label="Удалить" color="red" @click="deleteProduct" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
import Api from "src/shared/api/Api.js";
import { Notify } from "quasar";

const STATUS_OPTIONS = [
  { label: "Активен", value: "active" },
  { label: "Неактивен", value: "inactive" },
];

export default {
  name: "SellerProductsPage",
  data() {
    return {
      searchQuery: '',
      categoryFilter: null,
      statusFilter: null,
      appliedSearchQuery: '',
      appliedCategoryId: null,
      appliedStatus: null,
      loading: false,
      deleteDialog: false,
      selectedProduct: null,
      categoryOptions: [],
      statusOptions: STATUS_OPTIONS,
      columns: [
        {
          name: 'photo',
          label: 'Фото',
          field: 'photo',
          align: 'center',
          sortable: false
        },
        {
          name: 'name',
          label: 'Название',
          field: 'name',
          align: 'left',
          sortable: true
        },
        {
          name: 'category',
          label: 'Категория',
          field: 'category',
          align: 'left',
          sortable: true
        },
        {
          name: 'price',
          label: 'Цена',
          field: 'price',
          align: 'right',
          sortable: true
        },
        {
          name: 'stock',
          label: 'Остаток',
          field: 'stock',
          align: 'center',
          sortable: true
        },
        {
          name: 'status',
          label: 'Статус',
          field: 'status',
          align: 'center',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Действия',
          field: 'actions',
          align: 'center',
          sortable: false
        }
      ],
      products: []
    }
  },
  computed: {
    filteredProducts() {
      const search = String(this.appliedSearchQuery || "").trim().toLowerCase();
      const categoryId = this.appliedCategoryId;
      const status = this.appliedStatus;

      return (this.products || []).filter((product) => {
        if (search && !String(product.name || "").toLowerCase().includes(search)) return false;
        if (categoryId && Number(product.category_id) !== Number(categoryId)) return false;
        if (status && product.status !== status) return false;
        return true;
      });
    },
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
    this.applyFilters();
  },
  methods: {
    paginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex}-${endRowIndex} из ${totalRowsNumber}`;
    },
    applyFilters() {
      this.appliedSearchQuery = this.searchQuery;
      this.appliedCategoryId = this.categoryFilter;
      this.appliedStatus = this.statusFilter;
    },
    parseFirstPhoto(photos) {
      if (!photos) return null;
      if (Array.isArray(photos)) return photos[0] || null;
      if (typeof photos === "string") {
        try {
          const parsed = JSON.parse(photos);
          if (Array.isArray(parsed)) return parsed[0] || null;
        } catch {
          return null;
        }
      }
      return null;
    },
    async fetchCategories() {
      try {
        const { data } = await Api.get("/api/categories");
        const categories = data?.success ? (data.data?.categories || []) : [];
        this.categoryOptions = categories.map((category) => ({
          label: category.name,
          value: category.category_id,
        }));
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
        Notify.create({ type: "negative", message: "Не удалось загрузить категории" });
      }
    },
    async fetchProducts() {
      try {
        this.loading = true;
        const { data } = await Api.get("/api/products?limit=500");
        const rawProducts = data?.success ? (data.data || []) : [];

        this.products = rawProducts.map((product) => {
          const stock = Number(product.count ?? 0);
          const status = stock > 0 ? "active" : "inactive";
          const photo =
            this.parseFirstPhoto(product.photos) || "https://cdn.quasar.dev/img/parallax2.jpg";

          return {
            id: product.product_id,
            product_id: product.product_id,
            category_id: product.category_id,
            name: product.name,
            category: product.category_name,
            price: Number(product.price),
            stock,
            status,
            photo,
            _raw: product,
          };
        });
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        Notify.create({ type: "negative", message: "Не удалось загрузить товары" });
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(product) {
      this.selectedProduct = product
      this.deleteDialog = true
    },
    async deleteProduct() {
      if (!this.selectedProduct) return;
      try {
        await Api.delete(`/api/products/${this.selectedProduct.id}`);
        this.products = this.products.filter(p => p.id !== this.selectedProduct.id)
        Notify.create({ type: "positive", message: "Товар удалён" });
      } catch (error) {
        console.error("Ошибка удаления товара:", error);
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Не удалось удалить товар";
        Notify.create({ type: "negative", message });
      } finally {
        this.selectedProduct = null
      }
    }
  }
}
</script>
