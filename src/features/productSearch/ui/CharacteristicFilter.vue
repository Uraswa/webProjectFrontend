<!-- features/productSearch/ui/CharacteristicFilter.vue -->
<template>
  <div class="characteristic-filters">
    <div v-if="filters.length === 0" class="text-caption text-grey-7">
      Нет доступных фильтров для этой категории
    </div>
    
    <div v-for="filter in filters" :key="filter.id" class="q-mb-md">
      <div class="text-weight-medium q-mb-xs">{{ filter.name }}</div>
      
      <!-- Тип: options (селект) -->
      <q-select
        v-if="filter.type === 'options' && filter.data.options"
        v-model="selectedOptions[filter.id]"
        :options="filter.data.options"
        outlined
        dense
        clearable
        multiple
        emit-value
        @update:model-value="handleOptionsChange(filter.id, $event)"
        placeholder="Выберите..."
        class="q-mb-xs"
      />
      
      <!-- Тип: bool (чекбокс) -->
      <div v-else-if="filter.type === 'bool'">
        <q-toggle
          v-model="selectedBool[filter.id]"
          :label="selectedBool[filter.id] ? 'Да' : 'Нет'"
          @update:model-value="handleBoolChange(filter.id, $event)"
        />
      </div>
      
      <!-- Тип: int или float (диапазон) -->
      <div v-else-if="filter.type === 'int' || filter.type === 'float'">
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-input
              v-model.number="selectedRange[filter.id].min"
              type="number"
              outlined
              dense
              :placeholder="`От ${filter.data.min_value || 0}`"
              @update:model-value="handleRangeChange(filter.id)"
            />
          </div>
          <div class="col">
            <q-input
              v-model.number="selectedRange[filter.id].max"
              type="number"
              outlined
              dense
              :placeholder="`До ${filter.data.max_value || 999999}`"
              @update:model-value="handleRangeChange(filter.id)"
            />
          </div>
        </div>
      </div>
      
      <!-- Тип: color (цвета) -->
      <div v-else-if="filter.type === 'color' && filter.data.options">
        <div class="row q-gutter-xs">
          <q-btn
            v-for="color in filter.data.options"
            :key="color"
            :color="getColorClass(color)"
            :text-color="getTextColor(color)"
            size="sm"
            :outline="selectedColors[filter.id] !== color"
            @click="handleColorChange(filter.id, color)"
            class="q-px-sm"
          >
            {{ color }}
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onMounted } from 'vue'
import type { CharacteristicFilter } from '../model/types'

export default defineComponent({
  name: 'CharacteristicFilter',
  props: {
    filters: {
      type: Array as PropType<CharacteristicFilter[]>,
      default: () => []
    },
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    // Состояния для разных типов фильтров
    const selectedOptions = ref<Record<number, string[]>>({})
    const selectedBool = ref<Record<number, boolean>>({})
    const selectedRange = ref<Record<number, { min?: number; max?: number }>>({})
    const selectedColors = ref<Record<number, string>>({})
    
    // Инициализация состояний из пропсов
    const initFromProps = () => {
      props.filters.forEach(filter => {
        if (filter.type === 'options') {
          selectedOptions.value[filter.id] = []
        } else if (filter.type === 'bool') {
          selectedBool.value[filter.id] = false
        } else if (filter.type === 'int' || filter.type === 'float') {
          selectedRange.value[filter.id] = {
            min: undefined,
            max: undefined
          }
        } else if (filter.type === 'color') {
          selectedColors.value[filter.id] = ''
        }
      })
    }
    
    onMounted(() => {
      initFromProps()
    })
    
    watch(() => props.filters, () => {
      initFromProps()
    }, { deep: true })
    
    // Обработчики изменений
    const handleOptionsChange = (filterId: number, values: string[]) => {
      selectedOptions.value[filterId] = values
      emitFilterChange(filterId, 'options', values)
    }
    
    const handleBoolChange = (filterId: number, value: boolean) => {
      selectedBool.value[filterId] = value
      emitFilterChange(filterId, 'bool', value ? 'true' : 'false')
    }
    
    const handleRangeChange = (filterId: number) => {
      const range = selectedRange.value[filterId]
      emit('change', {
        filterId: filterId.toString(),
        min: range.min?.toString(),
        max: range.max?.toString()
      })
    }
    
    const handleColorChange = (filterId: number, color: string) => {
      const isSelected = selectedColors.value[filterId] === color
      selectedColors.value[filterId] = isSelected ? '' : color
      emitFilterChange(filterId, 'color', isSelected ? undefined : color)
    }
    
    const emitFilterChange = (filterId: number, type: string, value?: any) => {
      emit('change', {
        filterId: filterId.toString(),
        value: value,
        type: type
      })
    }
    
    const getColorClass = (color: string) => {
      const colorMap: Record<string, string> = {
        'красный': 'red',
        'синий': 'blue',
        'зеленый': 'green',
        'желтый': 'yellow',
        'черный': 'dark',
        'белый': 'white',
        'серый': 'grey',
        'оранжевый': 'orange',
        'фиолетовый': 'purple'
      }
      return colorMap[color.toLowerCase()] || 'primary'
    }
    
    const getTextColor = (color: string) => {
      return color.toLowerCase() === 'белый' ? 'black' : 'white'
    }
    
    return {
      selectedOptions,
      selectedBool,
      selectedRange,
      selectedColors,
      handleOptionsChange,
      handleBoolChange,
      handleRangeChange,
      handleColorChange,
      getColorClass,
      getTextColor
    }
  }
})
</script>