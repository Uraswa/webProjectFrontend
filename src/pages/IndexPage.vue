<template>
  <q-page >

    <AdCarousel />

    <div class="col-12" style="margin-top: 25px">
      <DemoProductsGrid/>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

import DemoProductsGrid from 'src/widgets/DemoProductsGrid/ui/DemoProductsGrid.vue';
import AdCarousel from 'src/widgets/AdCarousel/ui/AdCarousel.vue'

export default defineComponent({
  name: 'IndexPage' ,
  components: {DemoProductsGrid, AdCarousel},
  data() {
    return {
      slide: 1
    }
  }
});
</script>
