<!-- features/productSearch/ui/CategoryFilter.vue -->
<template>
  <div class="category-filter">
    <div class="text-subtitle2 q-mb-sm">Категория</div>
    
    <q-select
      v-model="selectedCategoryId"
      :options="flatCategories"
      option-label="name"
      option-value="category_id"
      emit-value
      map-options
      outlined
      dense
      clearable
      placeholder="Все категории"
      @update:model-value="handleCategoryChange"
      :loading="loading"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label :style="{ paddingLeft: `${scope.opt.depth * 20}px` }">
              <q-icon v-if="scope.opt.depth > 0" name="subdirectory_arrow_right" size="xs" class="q-mr-xs" />
              {{ scope.opt.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useCategories } from '../model/useCategories'

export default defineComponent({
  name: 'CategoryFilter',
  props: {
    modelValue: {
      type: Number,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'category-change'],
  setup(props, { emit }) {
    const { flatCategories, loadCategories, loading } = useCategories()
    const selectedCategoryId = ref<number | undefined>(props.modelValue)
    
    // Загружаем категории при монтировании
    onMounted(async () => {
      await loadCategories()
    })
    
    // Следим за изменением пропса
    watch(() => props.modelValue, (newVal) => {
      selectedCategoryId.value = newVal
    })
    
    const handleCategoryChange = (categoryId?: number) => {
      selectedCategoryId.value = categoryId
      emit('update:modelValue', categoryId)
      emit('category-change', categoryId)
    }
    
    return {
      flatCategories,
      selectedCategoryId,
      loading,
      handleCategoryChange
    }
  }
})
</script>