<script>
import Api from "src/shared/api/Api.js";
import CenteredFormPage from "src/shared/ui/CenteredFormPage.vue";

export default {
  name: "ForgotPasswordPage",
  components: {CenteredFormPage},
  data: function () {
    return {
      email: "",
      err: "",
      is_loading: false
    }
  },
  methods: {
    async onSubmit(){
      this.is_loading = true;
      let response = await Api.post('/api/users/forgotPassword', {
        email: this.email
      });
      if (response.status === 200 && response.data.success) {
        this.$router.push("/mail-sent");
      } else {
        this.err = response.data.error;
      }
      this.is_loading = false;
    },
  },
}
</script>

<template>
  <CenteredFormPage>
      <q-form
        style="min-width: 320px"
        @submit="onSubmit"
        class="q-gutter-md"
      >
        <q-input
          v-model="email"
          label="Email"
          :rules="[
                val => !!val || 'Введите email',
                val => val.length < 256 || 'Email слишком длинный'
              ]"
        />
        <template v-if="err">
          <span class="text-red">{{err}}</span> <br>
        </template>
        <q-btn :loading="is_loading" style="margin-top: 10px" label="Восстановить" type="submit" color="primary"/>
        <p style="margin-top: 10px">
          <RouterLink to="/registration">Регистрация</RouterLink>
        </p>
        <p>
          <RouterLink to="/login">Войти</RouterLink>
        </p>
      </q-form>

    </CenteredFormPage>
</template>

<style scoped>

</style>
