<script>
import Api from "src/shared/api/Api.js";

export default {
  name: "AccountActivationPage",
  async mounted() {
    let response = await Api.get("/api/users/activateAccount?activation_link="+this.$route.params.link)
    if (response.status === 200) {
      let {accessToken, user_id } = response.data.data;
      Api.setToken(accessToken);
      this.$store.dispatch("setUserId", user_id)
      this.$router.push({ path: "/createProfile" });
    }
  }
}
</script>

<template>
  <q-page>

     <div v-if="is_activated" style="height: 100vh; width: 100%; display: flex; justify-content: center; align-items: center;">
          <q-form
            style="min-width: 320px"
            @submit="onSubmit"
            class="q-gutter-md"
          >
              <q-input
          v-model="nickname"
          label="Ваш никнейм"
          :rules="[
                val => val.length < 40 || 'Никнейм должен быть короче 40 символов',
                val => val.length !==0 || 'Никнейм не может быть пустым',
                val => /^(\w| |[А-Яа-я])+$/g.test(val) || 'Недопустимые символы!',
                val => !(/([ _]{2,}| _|_ )/g.test(val)) || 'Не больше одного пробела или _ подряд!',
              ]"
        />
        <template v-if="error_nickname">
          <span class="text-red">{{error_nickname}}</span>
          <br>
        </template></q-form>
     </div>

      Активация... {{$route.params.link}}
  </q-page>
</template>

<style scoped>

</style>
