<template>
  <div class="product-search-input">
    <q-input
      v-model="search"
      placeholder="Поиск товаров"
      outlined
      dense
      @keyup.enter="onSearch"
    >
      <template #append>
        <q-icon
          name="search"
          class="cursor-pointer"
          @click="onSearch"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'ProductSearchInput',

  data() {
    return {
      search: ''
    }
  },

  methods: {
    onSearch() {
      if (!this.search.trim()) return

      this.$router.push({
        path: '/search/',
        query: {
          search: this.search.trim()
        }
      })
    }
  }
}
</script>

<style scoped>
.product-search-input {
  width: 100%;
}
</style>