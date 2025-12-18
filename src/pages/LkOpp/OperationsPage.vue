<script>
import { useOppId } from 'src/features/oppSelection/lib/useOppId'

export default {
  name: 'OperationsPage',
  data() {
    return {
      oppId: null,
      operations: [
        {
          title: 'Приём от продавца',
          description: 'Зарегистрировать получение товара от продавца',
          icon: 'inventory',
          color: 'blue',
          route: null
        },
        {
          title: 'Передача логистике',
          description: 'Передать товар в логистическую службу',
          icon: 'local_shipping',
          color: 'orange',
          route: null
        },
        {
          title: 'Приём от логистики',
          description: 'Подтвердить получение товара от логистики',
          icon: 'inbox',
          color: 'teal',
          route: null
        },
        {
          title: 'Выдача покупателю',
          description: 'Выдать заказ покупателю',
          icon: 'person_check',
          color: 'green',
          route: null
        }
      ]
    }
  },
  created() {
    const { getOppId } = useOppId()
    this.oppId = getOppId()

    if (!this.oppId) {
      this.$router.push('/pvz-owner/select')
    }
  },
  methods: {
    openOperation(operation) {
      this.$q.notify({
        type: 'info',
        message: `Форма "${operation.title}" будет реализована в следующем шаге`
      })
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4 class="text-h4 text-weight-bold q-mb-xs">Операции</h4>
      <p class="text-caption text-grey-7 q-mb-lg">
        Выполнение операций с товарами и заказами
      </p>

      <div class="row q-col-gutter-md">
        <div
          v-for="(operation, index) in operations"
          :key="index"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card
            class="operation-card cursor-pointer"
            @click="openOperation(operation)"
            v-ripple
          >
            <q-card-section class="text-center">
              <q-icon
                :name="operation.icon"
                :color="operation.color"
                size="3em"
                class="q-mb-md"
              />
              <div class="text-h6 q-mb-xs">{{ operation.title }}</div>
              <p class="text-body2 text-grey-7">{{ operation.description }}</p>
            </q-card-section>

            <q-separator />

            <q-card-actions align="center">
              <q-btn
                label="Открыть"
                :color="operation.color"
                unelevated
                class="full-width"
                @click.stop="openOperation(operation)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <q-card flat bordered class="q-mt-xl">
        <q-card-section>
          <div class="text-h6 q-mb-md">Информация</div>
          <p class="text-body2 text-grey-7">
            На этой странице вы можете выполнить следующие операции:
          </p>
          <ul class="text-body2 text-grey-7">
            <li><strong>Приём от продавца:</strong> регистрация получения товара от продавца на ПВЗ</li>
            <li><strong>Передача логистике:</strong> передача товара курьерской службе для доставки</li>
            <li><strong>Приём от логистики:</strong> подтверждение получения товара от курьерской службы</li>
            <li><strong>Выдача покупателю:</strong> выдача заказа конечному покупателю</li>
          </ul>
          <q-banner class="bg-info text-white q-mt-md" rounded>
            <template v-slot:avatar>
              <q-icon name="info" />
            </template>
            Формы для выполнения операций будут реализованы в следующей версии
          </q-banner>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
.operation-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.operation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
