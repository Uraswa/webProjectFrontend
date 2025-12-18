<script>
import Api from "src/shared/api/Api.js";
import CenteredFormPage from "src/shared/ui/CenteredFormPage.vue";

export default {
  name: "ChangePasswordPage",
  components: {CenteredFormPage},
  data(){
    return {
      password: "",
      is_loading: false,
      err: ""
    }
  },
  methods:{
    async onSubmit(){
      this.is_loading = true;
      let response = await Api.post("/api/users/changePassword", {
        password_change_token: this.$route.params.link,
        password: this.password
      });
      if (response.status === 200 && response.data.success) {
        let {accessToken, user_id } = response.data.data;
        Api.setToken(accessToken);
        this.$store.dispatch("setUserId", user_id)
        this.$router.push({ path: "/" });
      } else {
        this.err = response.data.error;
      }

      this.is_loading = false;
    }
  }
}
</script>

<template>
  <centered-form-page>
      <q-form
        style="min-width: 320px"
        @submit="onSubmit"
        class="q-gutter-md"
      >

        <q-input
          v-model="password"
          label="Пароль"
          type="password"
          :rules="[
                val => !!val || 'Введите пароль',
                val => val.length < 40 || 'Пароль слишком длинный'
              ]"
        />
        <template v-if="err">
          <span class="text-red">{{err}}</span> <br>
        </template>
        <q-btn :loading="is_loading" style="margin-top: 10px" label="Сменить пароль" type="submit" color="primary"/>
      </q-form>
    </centered-form-page>
</template>

<style scoped>

</style>
