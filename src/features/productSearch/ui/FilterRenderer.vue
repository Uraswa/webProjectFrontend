<template>
  <div>
    <!-- Тип: options (чекбоксы) -->
    <div v-if="filter.type === 'options' && filter.data?.options">
      <q-list dense>
        <q-item 
          v-for="option in filter.data.options" 
          :key="option" 
          tag="label" 
          v-ripple
        >
          <q-item-section avatar>
            <q-checkbox 
              :model-value="isOptionSelected(option)"
              @update:model-value="toggleOption(option, $event)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ option }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    
    <!-- Тип: color (кнопки с цветами) -->
    <div v-else-if="filter.type === 'color' && filter.data?.options">
      <div class="row q-col-gutter-xs">
        <div
          v-for="color in filter.data.options"
          :key="color"
          class="col-auto"
        >
          <q-btn
            round
            size="sm"
            :style="{ backgroundColor: getColorHex(color) }"
            :class="selectedColor === color ? 'selected-color-btn' : ''"
            @click="toggleColor(color)"
          >
            <q-icon
              v-if="selectedColor === color"
              name="check"
              size="xs"
              color="white"
            />
          </q-btn>
        </div>
      </div>
    </div>
    
    <!-- Тип: int или float (диапазон) -->
    <div v-else-if="filter.type === 'int' || filter.type === 'float'">
      <div class="row items-center q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="selectedMin"
            type="number"
            label="От"
            dense
            outlined
            :placeholder="`${filter.data?.min_value || 0}`"
            @update:model-value="updateMin"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="selectedMax"
            type="number"
            label="До"
            dense
            outlined
            :placeholder="`${filter.data?.max_value || 999999}`"
            @update:model-value="updateMax"
          />
        </div>
      </div>
    </div>
    
    <!-- Тип: bool (toggle) -->
    <div v-else-if="filter.type === 'bool'">
      <q-toggle
        v-model="selectedBool"
        :label="selectedBool ? 'Да' : 'Нет'"
        @update:model-value="toggleBool"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import type { CharacteristicFilter } from '../model/types'

export default defineComponent({
  name: 'FilterRenderer',
  props: {
    filter: {
      type: Object as PropType<CharacteristicFilter>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const selectedOptions = ref<string[]>([])
    const selectedColor = ref<string>('')
    const selectedMin = ref<number | undefined>(undefined)
    const selectedMax = ref<number | undefined>(undefined)
    const selectedBool = ref<boolean>(false)
    
    // Цветовая карта
    const colorMap: Record<string, string> = {
      'черный': '#000000',
      'белый': '#ffffff',
      'синий': '#1976d2',
      'красный': '#d32f2f',
      'зеленый': '#388e3c',
      'желтый': '#fbc02d',
      'серый': '#9e9e9e',
      'оранжевый': '#f57c00',
      'фиолетовый': '#7b1fa2',
      'розовый': '#c2185b'
    }
    
    const getColorHex = (colorName: string) => {
      return colorMap[colorName.toLowerCase()] || '#9e9e9e'
    }
    
    const isOptionSelected = (option: string) => {
      return selectedOptions.value.includes(option)
    }
    
    const toggleOption = (option: string, selected: boolean) => {
      if (selected) {
        if (!selectedOptions.value.includes(option)) {
          selectedOptions.value.push(option)
        }
      } else {
        selectedOptions.value = selectedOptions.value.filter(v => v !== option)
      }
      emitChange()
    }
    
    const toggleColor = (color: string) => {
      if (selectedColor.value === color) {
        selectedColor.value = ''
      } else {
        selectedColor.value = color
      }
      emitChange()
    }
    
    const updateMin = () => {
      emitChange()
    }
    
    const updateMax = () => {
      emitChange()
    }
    
    const toggleBool = (value: boolean) => {
      selectedBool.value = value
      emitChange()
    }
    
    const emitChange = () => {
      console.log('📤 [FilterRenderer] emitChange:', {
        filterId: props.filter.id.toString(),
        type: props.filter.type,
        selectedOptions: selectedOptions.value,
        selectedColor: selectedColor.value,
        selectedMin: selectedMin.value,
        selectedMax: selectedMax.value,
        selectedBool: selectedBool.value
      })
      
      if (props.filter.type === 'int' || props.filter.type === 'float') {
        // Для диапазона
        emit('change', {
          filterId: props.filter.id.toString(),
          min: selectedMin.value?.toString(),
          max: selectedMax.value?.toString()
        })
      } else if (props.filter.type === 'bool') {
        // Для boolean
        emit('change', {
          filterId: props.filter.id.toString(),
          value: selectedBool.value ? 'true' : 'false'
        })
      } else if (props.filter.type === 'color') {
        // Для цвета - одно значение
        emit('change', {
          filterId: props.filter.id.toString(),
          value: selectedColor.value || undefined
        })
      } else if (props.filter.type === 'options') {
        // Для мультиселекта отправляем МАССИВ значений
        emit('change', {
          filterId: props.filter.id.toString(),
          values: selectedOptions.value.length > 0 ? selectedOptions.value : undefined
        })
      }
    }
    
    // Следим за изменением фильтра (например, при смене категории)
    watch(() => props.filter, () => {
      // Сбрасываем значения при смене фильтра
      selectedOptions.value = []
      selectedColor.value = ''
      selectedMin.value = undefined
      selectedMax.value = undefined
      selectedBool.value = false
    })
    
    return {
      selectedOptions,
      selectedColor,
      selectedMin,
      selectedMax,
      selectedBool,
      getColorHex,
      isOptionSelected,
      toggleOption,
      toggleColor,
      updateMin,
      updateMax,
      toggleBool
    }
  }
})
</script>

<style scoped>
.selected-color-btn {
  border: 2px solid #1976d2 !important;
  box-shadow: 0 0 0 1px #1976d2;
}
</style>