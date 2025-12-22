<script>
export default {
  name: "CenteredFormPage"
}
</script>

<template>
  <q-page>
    <div style="display: flex; height: 100vh; justify-content: center; align-items: center">
      <slot name="default"></slot>
    </div>
  </q-page>
</template>

<style scoped>

</style>
