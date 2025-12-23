<template>
  <div class="product-characteristics-editor">
    <div class="text-subtitle2 q-mb-md">Характеристики товара</div>

    <div v-if="loading" class="q-pa-md">
      <q-skeleton type="text" class="q-mb-sm" />
      <q-skeleton type="text" class="q-mb-sm" />
      <q-skeleton type="text" class="q-mb-sm" />
    </div>

    <div v-else-if="!categoryId" class="text-grey-7 q-pa-md bg-grey-2 rounded-borders">
      Выберите категорию, чтобы добавить характеристики товара
    </div>

    <div v-else-if="characteristics.length === 0" class="text-grey-7 q-pa-md bg-grey-2 rounded-borders">
      У этой категории нет характеристик
    </div>

    <div v-else class="q-gutter-md">
      <div v-for="char in characteristics" :key="char.characteristic_id" class="characteristic-item">
        <div class="text-caption text-weight-medium q-mb-xs">
          {{ char.name }}
          <q-badge v-if="char.allow_in_filter" color="blue" label="Фильтр" class="q-ml-xs" />
        </div>

        <!-- Тип: options (выпадающий список) -->
        <q-select
          v-if="char.type === 'options'"
          v-model="values[char.characteristic_id]"
          :options="char.data.options"
          outlined
          dense
          clearable
          placeholder="Выберите значение"
          @update:model-value="emitChange"
        />

        <!-- Тип: float (число с плавающей точкой) -->
        <q-input
          v-else-if="char.type === 'float'"
          v-model.number="values[char.characteristic_id]"
          type="number"
          outlined
          dense
          clearable
          :min="char.data?.min_value"
          :max="char.data?.max_value"
          :step="0.1"
          :hint="`От ${char.data?.min_value || 0} до ${char.data?.max_value || 'не ограничено'}`"
          @update:model-value="emitChange"
        />

        <!-- Тип: int (целое число) -->
        <q-input
          v-else-if="char.type === 'int'"
          v-model.number="values[char.characteristic_id]"
          type="number"
          outlined
          dense
          clearable
          :min="char.data?.min_value"
          :max="char.data?.max_value"
          :step="1"
          :hint="`От ${char.data?.min_value || 0} до ${char.data?.max_value || 'не ограничено'}`"
          @update:model-value="emitChange"
        />

        <!-- Тип: bool (переключатель) -->
        <q-toggle
          v-else-if="char.type === 'bool'"
          v-model="values[char.characteristic_id]"
          :label="values[char.characteristic_id] ? 'Да' : 'Нет'"
          @update:model-value="emitChange"
        />

        <!-- Тип: color (выбор цвета из опций) -->
        <q-select
          v-else-if="char.type === 'color'"
          v-model="values[char.characteristic_id]"
          :options="char.data.options"
          outlined
          dense
          clearable
          placeholder="Выберите цвет"
          @update:model-value="emitChange"
        >
          <template v-slot:prepend>
            <q-icon
              v-if="values[char.characteristic_id]"
              name="circle"
              :style="{ color: getColorHex(values[char.characteristic_id]) }"
            />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon name="circle" :style="{ color: getColorHex(scope.opt) }" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Неизвестный тип -->
        <q-input
          v-else
          v-model="values[char.characteristic_id]"
          outlined
          dense
          clearable
          placeholder="Введите значение"
          @update:model-value="emitChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Api from "src/shared/api/Api.js";

export default {
  name: "ProductCharacteristicsEditor",
  props: {
    categoryId: {
      type: Number,
      default: null,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      loading: false,
      characteristics: [],
      values: {},
    };
  },
  watch: {
    categoryId: {
      immediate: true,
      async handler(newCategoryId, oldCategoryId) {
        if (newCategoryId) {
          await this.loadCharacteristics();
        } else {
          this.characteristics = [];
          this.values = {};
          this.emitChange();
        }
      },
    },
    modelValue: {
      immediate: true,
      deep: true,
      handler(newValue) {
        // Синхронизируем значения с пропсом только если они действительно изменились
        if (newValue && typeof newValue === "object") {
          // Сравниваем значения, чтобы избежать зацикливания
          const valuesChanged = JSON.stringify(this.values) !== JSON.stringify(newValue);
          if (valuesChanged) {
            this.values = { ...newValue };
          }
        }
      },
    },
  },
  methods: {
    async loadCharacteristics() {
      if (!this.categoryId) return;

      try {
        this.loading = true;
        const { data } = await Api.get(`/api/categories/${this.categoryId}/characteristics`);

        if (data?.success && Array.isArray(data.data)) {
          this.characteristics = data.data;

          // Сохраняем текущие значения перед обновлением
          const existingValues = { ...this.values };

          // Инициализируем только те значения, которых еще нет
          this.characteristics.forEach(char => {
            const charId = char.characteristic_id;

            // Если значение уже есть (пришло из modelValue), не трогаем его
            if (charId in existingValues) {
              return;
            }

            // Для булевых характеристик инициализируем значением false только если нет значения
            if (char.type === 'bool' && !(charId in this.values)) {
              this.values[charId] = false;
            }
          });

          // Восстанавливаем существующие значения
          Object.keys(existingValues).forEach(key => {
            this.values[key] = existingValues[key];
          });
        } else {
          this.characteristics = [];
        }
      } catch (error) {
        console.error("Ошибка загрузки характеристик:", error);
        this.characteristics = [];
      } finally {
        this.loading = false;
      }
    },
    emitChange() {
      // Фильтруем пустые значения
      const cleanedValues = {};
      Object.keys(this.values).forEach((key) => {
        const value = this.values[key];

        // Пропускаем null и undefined
        if (value === null || value === undefined) {
          return;
        }

        // Пропускаем пустые строки (включая строки из одних пробелов)
        if (typeof value === "string" && value.trim() === "") {
          return;
        }

        // Пропускаем NaN для чисел
        if (typeof value === "number" && isNaN(value)) {
          return;
        }

        // Пропускаем пустые массивы
        if (Array.isArray(value) && value.length === 0) {
          return;
        }

        // Для булевых значений false - это валидное значение, поэтому включаем его
        cleanedValues[key] = value;
      });
      this.$emit("update:modelValue", cleanedValues);
    },
    getColorHex(colorName) {
      const colorMap = {
        черный: "#000000",
        белый: "#ffffff",
        синий: "#1976d2",
        красный: "#d32f2f",
        зеленый: "#388e3c",
        желтый: "#fbc02d",
        серый: "#9e9e9e",
        оранжевый: "#f57c00",
        фиолетовый: "#7b1fa2",
        розовый: "#c2185b",
      };
      return colorMap[colorName?.toLowerCase()] || "#9e9e9e";
    },
  },
};
</script>

<style scoped>
.characteristic-item {
  padding: 8px 0;
}
</style>
