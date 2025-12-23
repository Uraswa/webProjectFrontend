<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: 'info'
    },
    color: {
      type: String,
      default: 'primary'
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <q-card class="stat-card">
    <q-card-section>
      <div v-if="loading" class="row justify-center q-py-md">
        <q-spinner :color="color" size="2em" />
      </div>

      <div v-else class="row items-center no-wrap">
        <div class="col">
          <div class="text-grey-7 text-subtitle2">{{ title }}</div>
          <div class="text-h4 text-weight-bold q-mt-sm" :class="`text-${color}`">
            {{ value }}
          </div>
        </div>
        <div class="col-auto">
          <q-icon :name="icon" size="3em" :color="color" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.stat-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
