<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el label="Главная" icon="home"/>
      <q-breadcrumbs-el label="Одежда"/>
    </q-breadcrumbs>

    <!-- Заголовок и сортировка -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="col">
        <h4 class="q-my-none text-weight-bold">Одежда</h4>
        <div class="text-caption text-grey-7">Найдено 245 товаров</div>
      </div>
      <div class="col-auto">
        <q-select
          v-model="sortBy"
          :options="sortOptions"
          label="Сортировка"
          dense
          outlined
          style="min-width: 200px"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Левая колонка - фильтры -->
      <div class="col-md-3 col-12">
        <q-card flat bordered class="q-pa-md" style="position: sticky; top: 0; left: 0">
          <div class="text-h6 text-weight-bold q-mb-md">Фильтры</div>

          <!-- Цена -->
          <q-expansion-item
            group="filters"
            label="Цена"
            default-opened
            header-class="text-weight-medium"
          >
            <div class="q-pa-sm">
              <div class="row items-center q-col-gutter-sm">
                <div class="col">
                  <q-input
                    v-model="priceMin"
                    label="От"
                    type="number"
                    dense
                    outlined
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="priceMax"
                    label="До"
                    type="number"
                    dense
                    outlined
                  />
                </div>
              </div>
              <q-btn
                label="Применить"
                color="primary"
                size="sm"
                class="full-width q-mt-sm"
                unelevated
              />
            </div>
          </q-expansion-item>

          <!-- Категории -->
          <q-expansion-item
            group="filters"
            label="Категории"
            default-opened
            header-class="text-weight-medium"
          >
            <q-list dense>
              <q-item v-for="category in categories" :key="category.id" tag="label" v-ripple>
                <q-item-section avatar>
                  <q-checkbox v-model="selectedCategories" :val="category.id"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ category.name }}</q-item-label>
                  <q-item-label caption>{{ category.count }} товаров</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Размеры -->
          <q-expansion-item
            group="filters"
            label="Размеры"
            header-class="text-weight-medium"
          >
            <div class="q-pa-sm">
              <div class="row q-col-gutter-xs">
                <div class="col-auto" v-for="size in sizes" :key="size">
                  <q-btn
                    :label="size"
                    :color="selectedSizes.includes(size) ? 'primary' : 'grey-5'"
                    :text-color="selectedSizes.includes(size) ? 'white' : 'dark'"
                    size="sm"
                    padding="xs sm"
                    @click="toggleSize(size)"
                  />
                </div>
              </div>
            </div>
          </q-expansion-item>

          <!-- Цвет -->
          <q-expansion-item
            group="filters"
            label="Цвет"
            header-class="text-weight-medium"
          >
            <div class="q-pa-sm">
              <div class="row q-col-gutter-xs">
                <div
                  v-for="color in colors"
                  :key="color.name"
                  class="col-auto"
                >
                  <q-btn
                    round
                    size="sm"
                    :style="{ backgroundColor: color.value }"
                    :color="selectedColors.includes(color.name) ? 'primary' : 'grey-5'"
                    @click="toggleColor(color.name)"
                  >
                    <q-icon
                      v-if="selectedColors.includes(color.name)"
                      name="check"
                      size="xs"
                      color="white"
                    />
                  </q-btn>
                </div>
              </div>
            </div>
          </q-expansion-item>

          <!-- Бренды -->
          <q-expansion-item
            group="filters"
            label="Бренды"
            header-class="text-weight-medium"
          >
            <q-list dense>
              <q-item v-for="brand in brands" :key="brand.id" tag="label" v-ripple>
                <q-item-section avatar>
                  <q-checkbox v-model="selectedBrands" :val="brand.id"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ brand.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ brand.count }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Кнопки фильтров -->
          <div class="q-mt-lg">
            <q-btn
              label="Применить фильтры"
              color="primary"
              class="full-width q-mb-sm"
              unelevated
            />
            <q-btn
              label="Сбросить"
              outline
              class="full-width"
              @click="resetFilters"
            />
          </div>
        </q-card>
      </div>

      <!-- Правая колонка - товары -->
      <div class="col-md-9 col-12">
        <DemoProductsGrid/>

        <div class="text-center q-mt-lg">
          <q-btn
            label="Показать еще"
            color="primary"
            outline
            icon="expand_more"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import DemoProductsGrid from 'src/widgets/DemoProductsGrid/ui/DemoProductsGrid.vue';

export default {
  name: "ProductFilterPage",
  components: {DemoProductsGrid},
  data() {
    return {
      sortBy: 'popular',
      sortOptions: [
        {label: 'По популярности', value: 'popular'},
        {label: 'По цене ↑', value: 'price_asc'},
        {label: 'По цене ↓', value: 'price_desc'},
        {label: 'По новизне', value: 'newest'},
        {label: 'По рейтингу', value: 'rating'}
      ],
      priceMin: 0,
      priceMax: 10000,
      selectedCategories: [],
      selectedSizes: [],
      selectedColors: [],
      selectedBrands: [],
      categories: [
        {id: 1, name: 'Футболки', count: 124},
        {id: 2, name: 'Рубашки', count: 67},
        {id: 3, name: 'Худи и свитшоты', count: 89},
        {id: 4, name: 'Брюки', count: 45},
        {id: 5, name: 'Джинсы', count: 78}
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        {name: 'black', value: '#000000'},
        {name: 'white', value: '#ffffff'},
        {name: 'blue', value: '#1976d2'},
        {name: 'red', value: '#d32f2f'},
        {name: 'green', value: '#388e3c'},
        {name: 'grey', value: '#9e9e9e'}
      ],
      brands: [
        {id: 1, name: 'Adidas', count: 34},
        {id: 2, name: 'Nike', count: 28},
        {id: 3, name: 'Puma', count: 22},
        {id: 4, name: 'Reebok', count: 18},
        {id: 5, name: 'New Balance', count: 15}
      ]
    }
  },
  methods: {
    toggleSize(size) {
      const index = this.selectedSizes.indexOf(size)
      if (index > -1) {
        this.selectedSizes.splice(index, 1)
      } else {
        this.selectedSizes.push(size)
      }
    },
    toggleColor(color) {
      const index = this.selectedColors.indexOf(color)
      if (index > -1) {
        this.selectedColors.splice(index, 1)
      } else {
        this.selectedColors.push(color)
      }
    },
    resetFilters() {
      this.selectedCategories = []
      this.selectedSizes = []
      this.selectedColors = []
      this.selectedBrands = []
      this.priceMin = 0
      this.priceMax = 10000
    }
  }
}
</script>
