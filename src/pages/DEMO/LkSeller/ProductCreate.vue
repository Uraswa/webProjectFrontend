<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Добавить товар</div>
        <div class="text-caption text-grey-7">Создание нового товара в вашем магазине</div>
      </div>
      <q-btn label="Назад" flat color="primary" icon="arrow_back" to="/seller/products" />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-select
                v-model="form.shopId"
                :options="shopOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                dense
                outlined
                clearable
                label="Магазин"
                :disable="loading"
                :rules="[(v) => !!v || 'Выберите магазин']"
              />
            </div>
            <div class="col-6">
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
            </div>
          </div>

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
            :disable="loading"
            :rules="[(v) => Number(v) > 0 || 'Введите цену']"
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

          <div class="row justify-end q-gutter-sm">
            <q-btn label="Отмена" flat color="primary" to="/seller/products" :disable="loading" />
            <q-btn label="Создать" color="primary" unelevated type="submit" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import Api from "src/shared/api/Api.js";
import { Notify } from "quasar";

export default {
  name: "SellerProductCreatePage",
  data() {
    return {
      loading: false,
      categoryOptions: [],
      shopOptions: [],
      form: {
        shopId: null,
        categoryId: null,
        name: "",
        description: "",
        price: null,
        photos: "",
      },
    };
  },
  mounted() {
    this.fetchShopsAndCategories();
  },
  methods: {
    async fetchShopsAndCategories() {
      try {
        this.loading = true;

        const [shopsResponse, categoriesResponse] = await Promise.all([
          Api.get("/api/shops"),
          Api.get("/api/categories"),
        ]);

        const shopsPayload = shopsResponse?.data;
        const shops = Array.isArray(shopsPayload) ? shopsPayload : (shopsPayload?.shops || []);
        this.shopOptions = shops.map((shop) => ({
          label: shop.name,
          value: shop.shop_id,
        }));

        const categoriesPayload = categoriesResponse?.data;
        const categories = categoriesPayload?.success ? (categoriesPayload.data?.categories || []) : [];
        this.categoryOptions = categories.map((category) => ({
          label: category.name,
          value: category.category_id,
        }));
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        Notify.create({ type: "negative", message: "Не удалось загрузить магазины/категории" });
      } finally {
        this.loading = false;
      }
    },
    parsePhotos(value) {
      const raw = String(value || "");
      const parts = raw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      return parts;
    },
    async onSubmit() {
      try {
        this.loading = true;

        const payload = {
          shopId: this.form.shopId,
          categoryId: this.form.categoryId,
          name: this.form.name,
          description: this.form.description,
          price: Number(this.form.price),
          photos: JSON.stringify(this.parsePhotos(this.form.photos)),
        };

        const { data } = await Api.post("/api/products", payload);
        if (!data?.success) {
          throw new Error(data?.error || "create_failed");
        }

        Notify.create({ type: "positive", message: "Товар создан" });
        this.$router.push("/seller/products");
      } catch (error) {
        console.error("Ошибка создания товара:", error);
        Notify.create({ type: "negative", message: "Не удалось создать товар" });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

