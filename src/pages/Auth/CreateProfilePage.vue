<script>
import Api from "src/shared/api/Api.js";
import CenteredFormPage from "src/shared/ui/CenteredFormPage.vue";

export default {
  name: "CreateProfilePage",
  components: {CenteredFormPage},
  data: function () {
    return {
      first_name: "",
      last_name: "",
      error_first_name: "",
      error_last_name: "",
      error_general: "",
      is_loading: false
    }
  },
  methods: {
    onSubmit: async function () {
      this.is_loading = true;
      this.error_first_name = "";
      this.error_last_name = "";
      this.error_general = "";

      let response = await Api.post("/api/createProfile", {
        first_name: this.first_name,
        last_name: this.last_name
      });

      if (response.status === 200 && response.data.success) {
        this.$router.push("/orders/");
      } else {
        if (response.data.error_field === "first_name") {
          this.error_first_name = response.data.error;
        } else if (response.data.error_field === "last_name") {
          this.error_last_name = response.data.error;
        } else {
          this.error_general = response.data.error;
        }
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
      <div class="text-h5 q-mb-md">Создание профиля</div>

      <q-input
        v-model="first_name"
        label="Имя"
        :rules="[
          val => !!val || 'Введите имя',
          val => val.length <= 100 || 'Имя не должно превышать 100 символов'
        ]"
      />
      <template v-if="error_first_name">
        <span class="text-red">{{ error_first_name }}</span>
        <br>
      </template>

      <q-input
        v-model="last_name"
        label="Фамилия"
        :rules="[
          val => !!val || 'Введите фамилию',
          val => val.length <= 100 || 'Фамилия не должна превышать 100 символов'
        ]"
      />
      <template v-if="error_last_name">
        <span class="text-red">{{ error_last_name }}</span>
        <br>
      </template>

      <template v-if="error_general">
        <span class="text-red">{{ error_general }}</span>
        <br>
      </template>

      <q-btn
        style="margin-top: 10px"
        :loading="is_loading"
        label="Создать профиль"
        type="submit"
        color="primary"
      />
    </q-form>
  </CenteredFormPage>
</template>

<style scoped>

</style>
