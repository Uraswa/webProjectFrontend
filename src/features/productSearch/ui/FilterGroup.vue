<!-- features/productSearch/ui/FilterGroup.vue -->
<template>
  <q-expansion-item
    :group="group"
    :label="label"
    :default-opened="defaultOpened"
    header-class="text-weight-medium"
  >
    <div class="q-pa-sm">
      <slot></slot>
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FilterGroup',
  props: {
    label: {
      type: String,
      required: true
    },
    group: {
      type: String,
      default: 'filters'
    },
    defaultOpened: {
      type: Boolean,
      default: false
    }
  }
})
</script>