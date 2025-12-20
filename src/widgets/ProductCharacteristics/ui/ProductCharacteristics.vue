<template>
  <div>
    <h5 class="text-h5 text-weight-bold q-mb-md">Характеристики</h5>
    
    <div v-if="!characteristics || Object.keys(characteristics).length === 0" class="text-center q-pa-xl bg-grey-2 rounded-borders">
      <q-icon name="info" size="4em" color="grey-4" class="q-mb-md" />
      <div class="text-grey-7">Нет характеристик для этого товара</div>
    </div>
    
    <q-card v-else flat bordered>
      <q-list separator>
        <q-item 
          v-for="(value, key) in characteristics" 
          :key="key"
          class="q-py-md"
        >
          <q-item-section>
            <!-- Показываем название характеристики -->
            <q-item-label caption class="text-weight-medium">
              {{ getCharacteristicName(key) }}
            </q-item-label>
            
            <!-- Значение характеристики -->
            <q-item-label class="text-body1">
              {{ value }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { characteristicsApi } from 'src/features/productDetails/api/characteristicsApi'

export default defineComponent({
  name: 'ProductCharacteristics',
  
  props: {
    characteristics: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },
  
  data() {
    return {
      characteristicNames: {} as Record<string, string>,
      loading: false
    }
  },
  
  mounted() {
    this.loadCharacteristicNames()
  },
  
  watch: {
    characteristics() {
      this.loadCharacteristicNames()
    }
  },
  
  methods: {
    async loadCharacteristicNames() {
      if (!this.characteristics) return
      
      const ids: number[] = []
      
      // Собираем только числовые ID
      Object.keys(this.characteristics).forEach(key => {
        const num = Number(key)
        if (!isNaN(num) && String(num) === key) {
          ids.push(num)
        }
      })
      
      if (ids.length === 0) return
      
      try {
        this.loading = true
        const names = await characteristicsApi.getCharacteristicNames(ids)
        if (names) {
          this.characteristicNames = names
        }
      } catch (error) {
        console.warn('Не удалось загрузить названия характеристик')
      } finally {
        this.loading = false
      }
    },
    
    getCharacteristicName(key: string): string {
      // 1. Custom характеристики
      if (key.startsWith('custom_char_')) {
        return key.replace('custom_char_', '')
      }
      
      // 2. Если есть название от сервера
      if (this.characteristicNames[key]) {
        return this.characteristicNames[key]
      }
      
      // 3. Если числовой ID, но название не загрузилось
      const num = Number(key)
      if (!isNaN(num) && String(num) === key) {
        return `Характеристика ${key}`
      }
      
      // 4. Любой другой ключ
      return key
    }
  }
})
</script>