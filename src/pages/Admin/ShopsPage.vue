<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Магазины</div>
        <div class="text-caption text-grey-7">Управление магазинами и владельцами</div>
      </div>
      <q-btn
        label="Добавить магазин"
        color="primary"
        icon="add"
        unelevated
        @click="openCreateDialog"
      />
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="searchQuery"
              placeholder="Поиск по названию или владельцу"
              dense
              outlined
              clearable
              debounce="400"
              @update:model-value="fetchShops"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              label="Обновить"
              color="primary"
              class="full-width"
              outline
              @click="fetchShops"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-table
        :rows="shops"
        :columns="columns"
        row-key="shop_id"
        :loading="loading"
        flat
        bordered
        no-data-label="Магазины не найдены"
      >
        <template v-slot:body-cell-owner="props">
          <q-td :props="props">
            <div>{{ getOwnerPrimary(props.row) }}</div>
            <div v-if="getOwnerSecondary(props.row)" class="text-caption text-grey-7">
              {{ getOwnerSecondary(props.row) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs justify-end">
              <q-btn
                icon="edit"
                size="sm"
                color="primary"
                dense
                flat
                @click="openEditDialog(props.row)"
              />
              <q-btn
                icon="delete"
                size="sm"
                color="negative"
                dense
                flat
                @click="confirmDelete(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <div v-if="errorMessage" class="text-negative q-mt-md">
      {{ errorMessage }}
    </div>

    <q-dialog v-model="formDialog" @hide="resetForm">
      <q-card style="min-width: 520px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? "Редактировать магазин" : "Создать магазин" }}</div>
        </q-card-section>

        <q-form @submit.prevent="submitForm">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="Название"
              dense
              outlined
              maxlength="255"
              counter
              :rules="[
                val => !!val || 'Название обязательно',
                val => !val || val.length <= 255 || 'Название не длиннее 255 символов'
              ]"
            />

            <q-input
              v-model="form.description"
              label="Описание"
              type="textarea"
              autogrow
              dense
              outlined
              maxlength="500"
              counter
              :rules="[
                val => !val || val.length <= 500 || 'Описание не длиннее 500 символов'
              ]"
            />

            <q-select
              v-model="form.owner"
              label="Владелец"
              :options="ownerOptions"
              :loading="ownerLoading"
              option-label="label"
              option-value="value"
              use-input
              fill-input
              hide-selected
              clearable
              input-debounce="400"
              @filter="filterOwners"
              :rules="[val => !!val || 'Владелец обязателен']"
            />

            <div v-if="formError" class="text-negative text-caption">
              {{ formError }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn
              label="Сохранить"
              color="primary"
              type="submit"
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Удалить магазин</div>
        </q-card-section>
        <q-card-section>
          Удалить магазин "{{ deleteTarget?.name }}"?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn
            label="Удалить"
            color="negative"
            :loading="deleting"
            @click="deleteShop"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { adminShopsApi } from "src/features/adminShops/api/adminShopsApi.js";
import { adminUsersApi } from "src/features/adminUsers/api/adminUsersApi.js";

export default {
  name: "AdminShopsPage",
  data() {
    return {
      shops: [],
      loading: false,
      errorMessage: "",
      searchQuery: "",
      columns: [
        {
          name: "shop_id",
          label: "ID",
          field: "shop_id",
          align: "left",
          sortable: true
        },
        {
          name: "name",
          label: "Название",
          field: "name",
          align: "left",
          sortable: true
        },
        {
          name: "description",
          label: "Описание",
          field: row => row.description || "-",
          align: "left",
          sortable: false
        },
        {
          name: "owner",
          label: "Владелец",
          field: row => row.owner_id || "",
          align: "left",
          sortable: false
        },
        {
          name: "actions",
          label: "Действия",
          field: "actions",
          align: "right",
          sortable: false
        }
      ],
      formDialog: false,
      formMode: "create",
      form: {
        id: null,
        name: "",
        description: "",
        owner: null
      },
      formError: "",
      saving: false,
      deleteDialog: false,
      deleteTarget: null,
      deleting: false,
      ownerOptions: [],
      ownerLoading: false
    };
  },
  computed: {
    isEdit() {
      return this.formMode === "edit";
    }
  },
  mounted() {
    this.fetchShops();
  },
  methods: {
    async fetchShops() {
      this.loading = true;
      this.errorMessage = "";
      const search = this.searchQuery ? this.searchQuery.trim() : "";

      try {
        const response = await adminShopsApi.listShops(search);
        const payload = response?.data;

        if (payload?.success === false) {
          this.errorMessage = payload.error || "Не удалось загрузить магазины.";
          this.shops = [];
          return;
        }

        const data = payload?.data || [];
        this.shops = Array.isArray(data) ? data : [];
      } catch (error) {
        if (this.handleAdminError(error)) return;
        this.errorMessage = this.getErrorMessage(error, "Не удалось загрузить магазины.");
      } finally {
        this.loading = false;
      }
    },

    openCreateDialog() {
      this.resetForm();
      this.formDialog = true;
    },

    openEditDialog(shop) {
      this.resetForm();
      this.formMode = "edit";
      this.form.id = shop.shop_id;
      this.form.name = shop.name || "";
      this.form.description = shop.description || "";

      const ownerOption = this.ownerOptionFromShop(shop);
      this.form.owner = ownerOption;
      this.ownerOptions = ownerOption ? [ownerOption] : [];
      this.formDialog = true;
    },

    confirmDelete(shop) {
      this.deleteTarget = shop;
      this.deleteDialog = true;
    },

    async submitForm() {
      this.formError = "";
      const name = this.form.name ? this.form.name.trim() : "";
      const description = this.form.description ? this.form.description.trim() : "";
      const ownerId = this.form.owner?.value;

      if (!name) {
        this.formError = "Название обязательно.";
        return;
      }

      if (!ownerId) {
        this.formError = "Владелец обязателен.";
        return;
      }

      const payload = {
        name,
        owner_id: ownerId
      };

      if (description) {
        payload.description = description;
      }

      this.saving = true;
      try {
        if (this.isEdit) {
          await adminShopsApi.updateShop(this.form.id, payload);
        } else {
          await adminShopsApi.createShop(payload);
        }

        this.formDialog = false;
        await this.fetchShops();
      } catch (error) {
        if (this.handleAdminError(error)) return;
        this.formError = this.getErrorMessage(error, "Не удалось сохранить магазин.");
      } finally {
        this.saving = false;
      }
    },

    async deleteShop() {
      if (!this.deleteTarget) return;

      this.deleting = true;
      try {
        await adminShopsApi.deleteShop(this.deleteTarget.shop_id);
        await this.fetchShops();
      } catch (error) {
        if (this.handleAdminError(error)) return;
        this.errorMessage = this.getErrorMessage(error, "Не удалось удалить магазин.");
      } finally {
        this.deleting = false;
        this.deleteTarget = null;
      }
    },

    async filterOwners(val, update, abort) {
      if (this.ownerLoading) {
        abort();
        return;
      }

      this.ownerLoading = true;
      const search = val ? val.trim() : "";

      try {
        const response = await adminUsersApi.listActiveUsers(search);
        const payload = response?.data;

        if (payload?.success === false) {
          this.formError = payload.error || "Не удалось загрузить пользователей.";
          update(() => {
            this.ownerOptions = this.keepSelectedOwner([]);
          });
          return;
        }

        const data = payload?.data || [];
        const options = Array.isArray(data)
          ? data.map(this.buildOwnerOption)
          : [];

        update(() => {
          this.ownerOptions = this.keepSelectedOwner(options);
        });
      } catch (error) {
        if (this.handleAdminError(error)) {
          abort();
          return;
        }
        this.formError = this.getErrorMessage(error, "Не удалось загрузить пользователей.");
        update(() => {
          this.ownerOptions = this.keepSelectedOwner([]);
        });
      } finally {
        this.ownerLoading = false;
      }
    },

    buildOwnerOption(user) {
      const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
      const parts = [];
      if (name) parts.push(name);
      if (user.email) parts.push(user.email);
      const fallback = user.user_id ? `Пользователь #${user.user_id}` : "Пользователь";

      return {
        label: parts.length ? parts.join(" - ") : fallback,
        value: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      };
    },

    ownerOptionFromShop(shop) {
      if (!shop?.owner_id) return null;
      return this.buildOwnerOption({
        user_id: shop.owner_id,
        email: shop.email,
        first_name: shop.first_name,
        last_name: shop.last_name
      });
    },

    keepSelectedOwner(options) {
      if (!this.form.owner) return options;
      const exists = options.some(option => option.value === this.form.owner.value);
      return exists ? options : [this.form.owner, ...options];
    },

    getOwnerPrimary(shop) {
      const name = [shop.first_name, shop.last_name].filter(Boolean).join(" ").trim();
      if (name) return name;
      if (shop.email) return shop.email;
      return shop.owner_id ? `Пользователь #${shop.owner_id}` : "-";
    },

    getOwnerSecondary(shop) {
      const name = [shop.first_name, shop.last_name].filter(Boolean).join(" ").trim();
      return name && shop.email ? shop.email : "";
    },

    handleAdminError(error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        this.$router.push({
          path: "/login",
          query: { redirect: "/admin/shops" }
        });
        return true;
      }
      return false;
    },

    getErrorMessage(error, fallback) {
      return error?.response?.data?.error || error?.message || fallback;
    },

    resetForm() {
      this.formMode = "create";
      this.form = {
        id: null,
        name: "",
        description: "",
        owner: null
      };
      this.formError = "";
      this.ownerOptions = [];
    }
  }
};
</script>
