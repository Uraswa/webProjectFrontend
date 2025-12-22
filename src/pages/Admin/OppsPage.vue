<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">ПВЗ</div>
        <div class="text-caption text-grey-7">Управление пунктами выдачи</div>
      </div>
      <q-btn
        label="Добавить ПВЗ"
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
              placeholder="Поиск по адресу или владельцу"
              dense
              outlined
              clearable
              debounce="400"
              @update:model-value="fetchOpps"
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
              @click="fetchOpps"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-table
        :rows="opps"
        :columns="columns"
        row-key="opp_id"
        :loading="loading"
        flat
        bordered
        rows-per-page-label="Записей на странице"
        :rows-per-page-options="[5, 10, 20, 50]"
        :pagination-label="paginationLabel"
        no-data-label="ПВЗ не найдены"
      >
        <template v-slot:body-cell-enabled="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.enabled ? 'green' : 'grey'"
              :label="props.row.enabled ? 'Включен' : 'Выключен'"
            />
          </q-td>
        </template>

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
      <q-card style="min-width: 560px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? "Редактировать ПВЗ" : "Создать ПВЗ" }}</div>
        </q-card-section>

        <q-form @submit.prevent="submitForm">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="form.address"
              label="Адрес"
              dense
              outlined
              :rules="[val => !!val || 'Адрес обязателен']"
            />

            <div class="row q-col-gutter-md q-pl-md q-pr-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="form.latitude"
                  label="Широта"
                  type="number"
                  dense
                  outlined
                  :rules="[val => val !== null && val !== '' || 'Широта обязательна']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="form.longitude"
                  label="Долгота"
                  type="number"
                  dense
                  outlined
                  :rules="[val => val !== null && val !== '' || 'Долгота обязательна']"
                />
              </div>
            </div>

            <div class="q-mt-xs">
              <div class="row items-center">
                <div class="text-subtitle2">Статус ПВЗ:</div>
                <q-toggle
                  v-model="form.enabled"
                  label="Активен"
                  color="primary"
                  class="q-ml-md"
                />
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ statusHint }}
              </div>
            </div>

            <div>
              <div class="text-subtitle2 q-mb-xs">График работы</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.mon"
                    label="Понедельник"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.tue"
                    label="Вторник"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.wed"
                    label="Среда"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.thu"
                    label="Четверг"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.fri"
                    label="Пятница"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.sat"
                    label="Суббота"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.workTime.sun"
                    label="Воскресенье"
                    dense
                    outlined
                    placeholder="09:00-20:00"
                  />
                </div>
              </div>
            </div>

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
          <div class="text-h6">Удалить ПВЗ</div>
        </q-card-section>
        <q-card-section>
          Удалить ПВЗ "{{ deleteTarget?.address }}"?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn
            label="Удалить"
            color="negative"
            :loading="deleting"
            @click="deleteOpp"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { adminOppsApi } from "src/features/adminOpps/api/adminOppsApi.js";

export default {
  name: "AdminOppsPage",
  data() {
    return {
      opps: [],
      loading: false,
      errorMessage: "",
      searchQuery: "",
      columns: [
        {
          name: "opp_id",
          label: "ID",
          field: "opp_id",
          align: "left",
          sortable: true
        },
        {
          name: "address",
          label: "Адрес",
          field: "address",
          align: "left",
          sortable: true
        },
        {
          name: "coords",
          label: "Координаты",
          field: row => `${row.latitude ?? "-"}, ${row.longitude ?? "-"}`,
          align: "left",
          sortable: false
        },
        {
          name: "enabled",
          label: "Статус",
          field: "enabled",
          align: "left",
          sortable: true
        },
        {
          name: "work_time",
          label: "График",
          field: row => formatWorkTime(row.work_time),
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
        address: "",
        latitude: null,
        longitude: null,
        enabled: true,
        workTime: {
          mon: "",
          tue: "",
          wed: "",
          thu: "",
          fri: "",
          sat: "",
          sun: ""
        },
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
    statusHint() {
        return this.form.enabled
        ? "ПВЗ отображается для пользователей"
        : "ПВЗ не отображается для пользователей";
    }
  },
  mounted() {
    this.fetchOpps();
  },
  methods: {
    async fetchOpps() {
      this.loading = true;
      this.errorMessage = "";
      const search = this.searchQuery ? this.searchQuery.trim() : "";

      try {
        const response = await adminOppsApi.listOpps(search);
        const payload = response?.data;

        if (payload?.success === false) {
          this.errorMessage = payload.error || "Не удалось загрузить ПВЗ.";
          this.opps = [];
          return;
        }

        const data = payload?.data || [];
        this.opps = Array.isArray(data) ? data : [];
      } catch (error) {
        if (this.handleAdminError(error)) return;
        this.errorMessage = this.getErrorMessage(error, "Не удалось загрузить ПВЗ.");
      } finally {
        this.loading = false;
      }
    },

    openCreateDialog() {
      this.resetForm();
      this.formDialog = true;
    },

    openEditDialog(opp) {
      this.resetForm();
      this.formMode = "edit";
      this.form.id = opp.opp_id;
      this.form.address = opp.address || "";
      this.form.latitude = opp.latitude ?? null;
      this.form.longitude = opp.longitude ?? null;
      this.form.enabled = opp.enabled !== undefined ? opp.enabled : true;
      this.form.workTime = this.normalizeWorkTime(opp.work_time);

      this.form.ownerId = opp.owner_id ?? null;
      this.formDialog = true;
    },

    confirmDelete(opp) {
      this.deleteTarget = opp;
      this.deleteDialog = true;
    },

    async submitForm() {
      this.formError = "";
      const address = this.form.address ? this.form.address.trim() : "";
      const ownerId = this.form.ownerId;

      if (!address) {
        this.formError = "Адрес обязателен.";
        return;
      }

      if (!ownerId) {
        this.formError = "ID владельца обязателен.";
        return;
      }

      if (this.form.latitude === null || this.form.latitude === "") {
        this.formError = "Широта обязательна.";
        return;
      }

      if (this.form.longitude === null || this.form.longitude === "") {
        this.formError = "Долгота обязательна.";
        return;
      }

      const workTimePayload = this.buildWorkTimePayload();

      const payload = {
        address,
        latitude: Number(this.form.latitude),
        longitude: Number(this.form.longitude),
        enabled: Boolean(this.form.enabled),
        owner_id: ownerId
      };

      if (workTimePayload) {
        payload.work_time = workTimePayload;
      }

      this.saving = true;
      try {
        if (this.isEdit) {
          await adminOppsApi.updateOpp(this.form.id, payload);
        } else {
          await adminOppsApi.createOpp(payload);
        }

        this.formDialog = false;
        await this.fetchOpps();
      } catch (error) {
        if (this.handleAdminError(error)) return;
        this.formError = this.getErrorMessage(error, "Не удалось сохранить ПВЗ.");
      } finally {
        this.saving = false;
      }
    },

    async deleteOpp() {
      if (!this.deleteTarget) return;

      this.deleting = true;
      try {
        await adminOppsApi.deleteOpp(this.deleteTarget.opp_id);
        await this.fetchOpps();
      } catch (error) {
        if (this.handleAdminError(error)) return;
        this.errorMessage = this.getErrorMessage(error, "Не удалось удалить ПВЗ.");
      } finally {
        this.deleting = false;
        this.deleteTarget = null;
      }
    },

    getOwnerPrimary(opp) {
      const name = [opp.first_name, opp.last_name].filter(Boolean).join(" ").trim();
      if (name) return name;
      if (opp.email) return opp.email;
      return opp.owner_id ? `Пользователь #${opp.owner_id}` : "-";
    },

    getOwnerSecondary(opp) {
      const name = [opp.first_name, opp.last_name].filter(Boolean).join(" ").trim();
      return name && opp.email ? opp.email : "";
    },

    normalizeWorkTime(workTime) {
      if (!workTime) {
        return {
          mon: "",
          tue: "",
          wed: "",
          thu: "",
          fri: "",
          sat: "",
          sun: ""
        };
      }
      if (typeof workTime === "string") {
        try {
          const parsed = JSON.parse(workTime);
          return this.normalizeWorkTime(parsed);
        } catch (error) {
          return {
            mon: "",
            tue: "",
            wed: "",
            thu: "",
            fri: "",
            sat: "",
            sun: ""
          };
        }
      }
      return {
        mon: workTime.mon || "",
        tue: workTime.tue || "",
        wed: workTime.wed || "",
        thu: workTime.thu || "",
        fri: workTime.fri || "",
        sat: workTime.sat || "",
        sun: workTime.sun || ""
      };
    },

    buildWorkTimePayload() {
      const entries = Object.entries(this.form.workTime || {})
        .map(([key, value]) => [key, value ? String(value).trim() : ""])
        .filter(([, value]) => value);

      if (entries.length === 0) {
        return undefined;
      }

      return Object.fromEntries(entries);
    },

    handleAdminError(error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        this.$router.push({
          path: "/login",
          query: { redirect: "/admin/opps" }
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
        address: "",
        latitude: null,
        longitude: null,
        enabled: true,
        workTime: {
          mon: "",
          tue: "",
          wed: "",
          thu: "",
          fri: "",
          sat: "",
          sun: ""
        },
        ownerId: null
      };
      this.formError = "";
    }
  }
};

function formatWorkTime(workTime) {
  if (!workTime) return "-";
  let value = workTime;
  if (typeof workTime === "string") {
    try {
      value = JSON.parse(workTime);
    } catch (error) {
      return workTime;
    }
  }
  const dayMap = {
    mon: "Пн",
    tue: "Вт",
    wed: "Ср",
    thu: "Чт",
    fri: "Пт",
    sat: "Сб",
    sun: "Вс"
  };
  const parts = Object.entries(value || {})
    .filter(([, time]) => time)
    .map(([day, time]) => `${dayMap[day] || day}: ${time}`);
  return parts.length ? parts.join(", ") : "-";
}
</script>
