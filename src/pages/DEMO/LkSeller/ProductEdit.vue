<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Редактировать товар</div>
        <div class="text-caption text-grey-7">Изменение данных товара</div>
      </div>
      <q-btn label="Назад" flat color="primary" icon="arrow_back" to="/seller/products" />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <q-expansion-item
          icon="info"
          label="Текущие параметры товара"
          default-opened
          expand-separator
        >
          <div v-if="loading && !product" class="q-pa-sm">
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" class="q-mb-sm" />
          </div>

          <div v-else-if="product">
            <q-list dense bordered class="rounded-borders">
              <q-item>
                <q-item-section>
                  <q-item-label caption>ID</q-item-label>
                  <q-item-label>{{ product.product_id }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Магазин</q-item-label>
                  <q-item-label>{{ product.shop_name || `#${product.shop_id}` }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Категория</q-item-label>
                  <q-item-label>{{ product.category_name || `#${product.category_id}` }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Остаток</q-item-label>
                  <q-item-label>{{ Number(product.count ?? 0) }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Статус</q-item-label>
                  <q-item-label>
                    <q-badge
                      :color="Number(product.count ?? 0) > 0 ? 'green' : 'orange'"
                      :label="Number(product.count ?? 0) > 0 ? 'Активен' : 'Неактивен'"
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Создан</q-item-label>
                  <q-item-label>{{ formatDate(product.created_at) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-if="productPhotos.length" class="q-mt-md">
              <div class="text-caption text-grey-7 q-mb-sm">Фото</div>
              <div class="row q-col-gutter-sm">
                <div v-for="(src, idx) in productPhotos" :key="idx" class="col-auto">
                  <q-img
                    :src="src"
                    width="72px"
                    height="72px"
                    class="rounded-borders"
                  />
                </div>
              </div>
            </div>

            <div v-if="hasCharacteristics" class="q-mt-md">
              <div class="text-caption text-grey-7 q-mb-sm">Характеристики (JSON)</div>
              <pre class="bg-grey-2 q-pa-sm rounded-borders overflow-auto">{{ prettyCharacteristics }}</pre>
            </div>

            <q-expansion-item
              v-if="hasTechnicalFields"
              class="q-mt-md"
              icon="code"
              label="Технические поля"
              expand-separator
            >
              <q-list dense bordered class="rounded-borders">
                <q-item v-if="product.variant_group_id">
                  <q-item-section>
                    <q-item-label caption>variant_group_id</q-item-label>
                    <q-item-label>{{ product.variant_group_id }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <div v-if="hasVariant" class="q-mt-sm">
                <div class="text-caption text-grey-7 q-mb-sm">variant (JSON)</div>
                <pre class="bg-grey-2 q-pa-sm rounded-borders overflow-auto">{{ prettyVariant }}</pre>
              </div>
            </q-expansion-item>
          </div>
        </q-expansion-item>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
          <q-select
            v-model="form.categoryId"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            dense
            outlined
            clearable
            label="Категория"
            :disable="loading"
            :rules="[(v) => !!v || 'Выберите категорию']"
          />

          <q-input
            v-model.trim="form.name"
            label="Название"
            dense
            outlined
            :disable="loading"
            :rules="[(v) => !!v || 'Введите название']"
          />

          <q-input
            v-model.number="form.price"
            label="Цена (₽)"
            dense
            outlined
            type="number"
            min="0"
            step="0.01"
            :disable="loading"
            :rules="[
              (v) => Number.isFinite(Number(v)) && Number(v) > 0 || 'Введите цену',
              (v) => Number(v) < 100000000 || 'Слишком большая цена'
            ]"
          />

          <q-input
            v-model.number="form.stockChange"
            label="Добавить поставку товара"
            dense
            outlined
            type="number"
            step="1"
            :disable="loading"
            hint="Положительное значение добавит товар, отрицательное - уменьшит остаток"
          />

          <q-input
            v-model="form.photos"
            label="Фото (через запятую: url или имя файла)"
            dense
            outlined
            :disable="loading"
            hint="Например: https://site/img1.jpg, https://site/img2.jpg"
          />

          <q-input
            v-model="form.description"
            label="Описание"
            type="textarea"
            outlined
            :disable="loading"
            autogrow
          />

          <q-separator class="q-my-md" />

          <ProductCharacteristicsEditor
            :category-id="form.categoryId"
            v-model="form.characteristics"
            :disable="loading"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn label="Отмена" flat color="primary" to="/seller/products" :disable="loading" />
            <q-btn label="Сохранить" color="primary" unelevated type="submit" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Api from "src/shared/api/Api.js";
import { Notify } from "quasar";
import ProductCharacteristicsEditor from "./components/ProductCharacteristicsEditor.vue";

export default {
  name: "SellerProductEditPage",
  components: {
    ProductCharacteristicsEditor,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      categoryOptions: [],
      product: null,
      form: {
        categoryId: null,
        name: "",
        description: "",
        price: null,
        photos: "",
        stockChange: 0,
        characteristics: {},
      },
      original: {
        variantGroupId: null,
      },
    };
  },
  mounted() {
    this.fetchCategoriesAndProduct();
  },
  computed: {
    productPhotos() {
      return this.parseBackendPhotos(this.product?.photos);
    },
    hasCharacteristics() {
      const characteristics = this.product?.characteristics;
      return characteristics && typeof characteristics === "object" && Object.keys(characteristics).length > 0;
    },
    prettyCharacteristics() {
      if (!this.hasCharacteristics) return "";
      return JSON.stringify(this.product.characteristics, null, 2);
    },
    hasVariant() {
      const variant = this.product?.variant;
      return Array.isArray(variant) ? variant.length > 0 : Boolean(variant);
    },
    prettyVariant() {
      if (!this.hasVariant) return "";
      return JSON.stringify(this.product?.variant, null, 2);
    },
    hasTechnicalFields() {
      return Boolean(this.product?.variant_group_id) || this.hasVariant;
    },
  },
  methods: {
    formatDate(value) {
      if (!value) return "—";
      try {
        return new Date(value).toLocaleString("ru-RU");
      } catch {
        return String(value);
      }
    },
    parseBackendPhotos(photos) {
      if (!photos) return [];
      if (Array.isArray(photos)) return photos.filter(Boolean);
      if (typeof photos === "string") {
        try {
          const parsed = JSON.parse(photos);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
          return [photos].filter(Boolean);
        }
      }
      return [];
    },
    parseFirstPhotosToInput(photos) {
      if (!photos) return "";
      if (Array.isArray(photos)) return photos.join(", ");
      if (typeof photos === "string") {
        try {
          const parsed = JSON.parse(photos);
          if (Array.isArray(parsed)) return parsed.join(", ");
        } catch {
          return String(photos);
        }
      }
      return "";
    },
    parsePhotos(value) {
      const raw = String(value || "");
      return raw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    },
    async fetchCategoriesAndProduct() {
      try {
        this.loading = true;

        const [categoriesResponse, productResponse] = await Promise.all([
          Api.get("/api/categories"),
          Api.get(`/api/seller/products/${this.id}`),
        ]);

        const categoriesPayload = categoriesResponse?.data;
        const categories = categoriesPayload?.success ? (categoriesPayload.data?.categories || []) : [];
        this.categoryOptions = categories.map((category) => ({
          label: category.name,
          value: category.category_id,
        }));

        const productPayload = productResponse?.data;
        const product = productPayload?.success ? productPayload.data : productPayload;
        if (!product) {
          Notify.create({ type: "negative", message: "Товар не найден" });
          this.$router.push("/seller/products");
          return;
        }

        this.product = product;
        this.form.categoryId = product.category_id ?? null;
        this.form.name = product.name ?? "";
        this.form.description = product.description ?? "";
        this.form.price = Number(product.price ?? 0) || null;
        this.form.photos = this.parseFirstPhotosToInput(product.photos);
        this.form.stockChange = 0;
        this.form.characteristics = product.characteristics ?? {};

        this.original.variantGroupId = product.variant_group_id ?? null;
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Не удалось загрузить товар";
        Notify.create({ type: "negative", message });
      } finally {
        this.loading = false;
      }
    },
    async onSubmit() {
      try {
        this.loading = true;

        const priceValue = Number(this.form.price);
        if (!Number.isFinite(priceValue) || priceValue <= 0) {
          Notify.create({ type: "negative", message: "Некорректная цена" });
          return;
        }

        const payload = {
          categoryId: this.form.categoryId,
          name: this.form.name,
          description: this.form.description,
          price: priceValue.toFixed(2),
          photos: JSON.stringify(this.parsePhotos(this.form.photos)),
          characteristics: this.form.characteristics || {},
          variantGroupId: this.original.variantGroupId,
          stockChange: Number(this.form.stockChange) || 0,
        };

        const { data } = await Api.put(`/api/products/${this.id}`, payload);
        if (!data?.success) {
          throw new Error(data?.error || "update_failed");
        }

        Notify.create({ type: "positive", message: "Товар обновлён" });
        this.$router.push("/seller/products");
      } catch (error) {
        console.error("Ошибка обновления товара:", error);
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Не удалось обновить товар";
        Notify.create({ type: "negative", message });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
