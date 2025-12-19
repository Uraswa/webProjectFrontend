<script>
import { getStatusColor, getStatusText } from 'src/entities/OppOrder/lib/statusHelpers'

export default {
  name: 'OrderStatusBadge',
  props: {
    status: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  computed: {
    badgeClass() {
      const sizeClasses = {
        sm: 'text-caption',
        md: 'text-body2',
        lg: 'text-body1'
      }
      return sizeClasses[this.size] || sizeClasses.md
    }
  },
  methods: {
    getStatusColor,
    getStatusText
  }
}
</script>

<template>
  <q-badge
    :color="getStatusColor(status)"
    :label="getStatusText(status)"
    :class="badgeClass"
  />
</template>

<style scoped>

</style>
