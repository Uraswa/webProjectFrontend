<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
  name: 'App',
  mounted() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.user_id) {
          this.$store.dispatch('setUserId', decoded.user_id);
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        // Опционально: удалить невалидный токен
        // localStorage.removeItem('token');
      }
    }
  }
});
</script>

<style>
a {
  text-decoration: none;
  color: inherit;
}
</style>
