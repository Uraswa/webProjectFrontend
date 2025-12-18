<script>
import Api from "src/shared/api/Api.js";
import CenteredFormPage from "src/shared/ui/CenteredFormPage.vue";

export default {
  name: "LoginPage",
  components: {CenteredFormPage},
  data: function () {
    return {
      email: "",
      password: "",
      error_auth: "",
      is_loading: false
    }
  },
  methods: {
    onSubmit: async function(){
      this.is_loading = true;
      let response = await Api.post("/api/users/login", {
        email: this.email,
        password: this.password,
      });

      if (response.status === 200 && response.data.success) {
        let {accessToken, user_id } = response.data.data;
        Api.setToken(accessToken);
        this.$store.dispatch("setUserId", user_id)
        this.$router.push({ path: "/" });
      } else {
        this.error_auth = response.data.error;
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
            <q-input
              v-model="password"
              label="Пароль"
              type="password"
              :rules="[
                val => !!val || 'Введите пароль',
                val => val.length < 40 || 'Пароль слишком длинный'
              ]"
            />
            <span class="text-red">{{error_auth}}</span>
            <br>
            <q-btn :loading="is_loading" style="margin-top: 10px" label="Войти" type="submit" color="primary"/>
            <p style="margin-top: 10px">
              <RouterLink to="/registration">Регистрация</RouterLink>
            </p>
            <p>
              <RouterLink to="/forgotPassword">Забыли пароль?</RouterLink>
            </p>


          </q-form>
        </CenteredFormPage>


</template>

<style scoped>

</style>
