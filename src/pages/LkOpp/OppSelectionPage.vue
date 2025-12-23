<script>
import { oppSelectionApi } from 'src/features/oppSelection/api/oppSelectionApi'
import { useOppId } from 'src/features/oppSelection/lib/useOppId'

export default {
  name: 'OppSelectionPage',
  data() {
    return {
      opps: [],
      loading: true
    }
  },
  async created() {
    await this.loadOpps()
  },
  methods: {
    async loadOpps() {
      this.loading = true
      try {
        this.opps = await oppSelectionApi.getUserOpps()
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке списка ПВЗ'
        })
      } finally {
        this.loading = false
      }
    },
    selectOpp(oppId) {
      const { setOppId } = useOppId()
      setOppId(oppId)
      this.$router.push('/pvz-owner/dashboard')
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="row justify-center q-mt-xl">
      <div class="col-12 col-md-10">
        <h4 class="text-h4 q-mb-md">Выберите пункт выдачи</h4>
        <p class="text-subtitle1 text-grey-7 q-mb-lg">
          Выберите ПВЗ, которым вы хотите управлять
        </p>

        <div v-if="loading" class="row justify-center q-py-xl">
          <q-spinner color="primary" size="3em" />
        </div>

        <div v-else-if="opps.length === 0" class="text-center q-py-xl">
          <q-icon name="store" size="4em" color="grey-5" class="q-mb-md" />
          <p class="text-h6 text-grey-7">У вас нет ПВЗ</p>
          <p class="text-body2 text-grey-6">
            Обратитесь к администратору для добавления ПВЗ
          </p>
        </div>

        <div v-else class="row q-col-gutter-md">
          <div
            v-for="opp in opps"
            :key="opp.opp_id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card
              class="cursor-pointer"
              @click="selectOpp(opp.opp_id)"
              v-ripple
            >
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ opp.name || `ПВЗ #${opp.opp_id}` }}</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="store" size="2em" color="primary" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-body2 text-grey-7">
                  <div class="row q-mb-xs">
                    <q-icon name="place" size="1.2em" class="q-mr-sm" />
                    <span>{{ opp.address }}</span>
                  </div>
                  <div v-if="opp.working_hours" class="row q-mb-xs">
                    <q-icon name="schedule" size="1.2em" class="q-mr-sm" />
                    <span>{{ opp.working_hours }}</span>
                  </div>
                  <div v-if="opp.phone" class="row">
                    <q-icon name="phone" size="1.2em" class="q-mr-sm" />
                    <span>{{ opp.phone }}</span>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn
                  label="Выбрать"
                  color="primary"
                  unelevated
                  class="full-width"
                  @click.stop="selectOpp(opp.opp_id)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}

.cursor-pointer:hover {
  transform: translateY(-4px);
}
</style>
