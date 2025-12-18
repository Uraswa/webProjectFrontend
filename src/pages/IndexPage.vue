<template>
  <q-page >

    <AdCarousel />

    <div class="col-12" style="margin-top: 25px">
      <PopularProductsGrid/>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

import PopularProductsGrid from 'src/features/popularProducts/ui/PopularProductsGrid.vue';
import AdCarousel from 'src/widgets/AdCarousel/ui/AdCarousel.vue'

export default defineComponent({
  name: 'IndexPage' ,
  components: {PopularProductsGrid, AdCarousel},
  data() {
    return {
      slide: 1
    }
  }
});
</script>
