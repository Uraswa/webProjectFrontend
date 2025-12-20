<!-- widgets/ProductCharacteristics/ui/ProductCharacteristics.vue -->
<template>
  <div>
    <h5 class="text-h5 text-weight-bold q-mb-md">Характеристики</h5>
    
    <div 
      v-if="!characteristics || Object.keys(characteristics).length === 0" 
      class="text-center q-pa-xl bg-grey-2 rounded-borders"
    >
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
            <q-item-label caption class="text-weight-medium">
              {{ formatKey(key) }}
            </q-item-label>
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

export default defineComponent({
  name: 'ProductCharacteristics',
  props: {
    characteristics: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },
  methods: {
    formatKey(key: string) {
      if (key.startsWith('custom_char_')) {
        return key.replace('custom_char_', '')
      }
      return `Характеристика ${key}`
    }
  }
})
</script>