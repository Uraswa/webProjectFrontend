<template>
  <q-page class="q-pa-md q-pa-sm-lg">
    <div class="row items-center justify-between q-mb-md q-mb-lg-sm">
      <div>
        <div class="text-h4 text-h5-sm text-weight-bold">Магазины</div>
        <div class="text-caption text-grey-7">Управление магазинами и владельцами</div>
      </div>
      <q-btn
        label="Добавить магазин"
        label-sm="Добавить"
        color="primary"
        icon="add"
        unelevated
        class="q-mt-xs q-mt-none-sm"
        @click="openCreateDialog"
      />
    </div>

    <q-card flat bordered class="q-mb-md q-mb-lg-sm">
      <q-card-section class="q-pa-md">
        <div class="row items-center q-col-gutter-sm q-col-gutter-md-sm">
          <div class="col-12 col-sm-8 col-md-6">
            <q-input
              v-model="searchQuery"
              placeholder="Поиск по названию или владельцу"
              dense
              outlined
              clearable
              debounce="400"
              @update:model-value="fetchShops"
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-4 col-md-2">
            <q-btn
              label="Обновить"
              label-sm="Обновить"
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
        rows-per-page-label="Записей на странице"
        :rows-per-page-options="[5, 10, 20, 50]"
        :pagination-label="paginationLabel"
        no-data-label="Магазины не найдены"
        :visible-columns="visibleColumns"
        class="admin-shops-table"
      >
        <template v-slot:body-cell-owner="props">
          <q-td :props="props">
            <div class="text-body2 text-body1-sm">{{ getOwnerPrimary(props.row) }}</div>
            <div v-if="getOwnerSecondary(props.row)" class="text-caption text-caption-sm text-grey-7">
              {{ getOwnerSecondary(props.row) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
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

    <q-dialog v-model="formDialog" @hide="resetForm" :maximized="$q.screen.lt.sm">
      <q-card :style="$q.screen.lt.sm ? 'width: 100%' : 'min-width: 520px'">
        <q-card-section>
          <div class="text-h6 text-h6-sm">{{ isEdit ? "Редактировать магазин" : "Создать магазин" }}</div>
        </q-card-section>

        <q-form @submit.prevent="submitForm">
          <q-card-section class="q-gutter-sm q-pa-md">
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

            <q-input
              v-model.number="form.ownerId"
              label="ID владельца"
              type="number"
              dense
              outlined
              class="q-mt-sm"
              :rules="[val => val !== null && val !== '' || 'ID владельца обязателен']"
            />

            <div v-if="formError" class="text-negative text-caption">
              {{ formError }}
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
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

    <q-dialog v-model="deleteDialog" :maximized="$q.screen.lt.sm">
      <q-card :style="$q.screen.lt.sm ? 'width: 100%' : ''">
        <q-card-section>
          <div class="text-h6 text-h6-sm">Удалить магазин</div>
        </q-card-section>
        <q-card-section>
          Удалить магазин "{{ deleteTarget?.name }}"?
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
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
        ownerId: null
      },
      formError: "",
      saving: false,
      deleteDialog: false,
      deleteTarget: null,
      deleting: false,
    };
  },
  computed: {
    isEdit() {
      return this.formMode === "edit";
    },
    visibleColumns() {
      if (this.$q.screen.lt.sm) {
        return ['name', 'owner', 'actions'];
      } else if (this.$q.screen.lt.md) {
        return ['shop_id', 'name', 'owner', 'actions'];
      }
      return ['shop_id', 'name', 'description', 'owner', 'actions'];
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

      this.form.ownerId = shop.owner_id ?? null;
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
      const ownerId = this.form.ownerId;

      if (!name) {
        this.formError = "Название обязательно.";
        return;
      }

      if (!ownerId) {
        this.formError = "ID владельца обязателен.";
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

    paginationLabel(firstRow, endRow, totalRows) {
      if (totalRows === 0) {
        return "0 из 0";
      }
      return `${firstRow}-${endRow} из ${totalRows}`;
    },

    resetForm() {
      this.formMode = "create";
      this.form = {
        id: null,
        name: "",
        description: "",
        ownerId: null
      };
      this.formError = "";
    }
  }
};
</script>

<style scoped>
@media (max-width: 600px) {
  .admin-shops-table :deep(.q-table__top) {
    padding: 8px;
  }
  
  .admin-shops-table :deep(.q-table__bottom) {
    padding: 8px;
  }
  
  .admin-shops-table :deep(.q-table thead tr th) {
    font-size: 12px;
    padding: 8px 4px;
  }
  
  .admin-shops-table :deep(.q-table tbody tr td) {
    font-size: 13px;
    padding: 8px 4px;
  }
}
</style>