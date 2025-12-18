<script>
import Api from "src/shared/api/Api.js";
import CenteredFormPage from "src/shared/ui/CenteredFormPage.vue";

export default {
  name: "RegistrationPage",
  components: {CenteredFormPage},
  data: function () {
    return {
      email: "",
      password: "",
      error_email: "",
      error_password: "",
      is_loading: false
    }
  },
  methods: {
    onSubmit: async function () {
      this.is_loading = true;
      let response = await Api.post("/api/users/createUser", {
        email: this.email,
        password: this.password
      });

      if (response.status === 200 && response.data.success) {
        this.$router.push("/mail-sent");
      } else {
        this.error_email = response.data.error_field === "email" ? response.data.error : "";
        this.error_password = response.data.error_field === "password" ? response.data.error : "";
      }

      this.is_loading = false;
    }
  }
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
      <template v-if="error_email">
        <span class="text-red">{{ error_email }}</span>
        <br>
      </template>
      <q-input
        v-model="password"
        label="Пароль"
        type="password"
        :rules="[
                val => !!val || 'Введите пароль',
                val => val.length < 40 || 'Пароль слишком длинный'
              ]"
      />
      <template v-if="error_password">
        <span class="text-red">{{ error_password }}</span>
        <br>
      </template>
      <q-btn style="margin-top: 10px" :loading="is_loading" label="Зарегистрироваться" type="submit" color="primary"/>
      <p style="margin-top: 10px">
        <RouterLink to="/login">Войти</RouterLink>
      </p>


    </q-form>
  </CenteredFormPage>
</template>

<style scoped>

</style>
