<template>
  <q-layout view="lHh Lpr lFf">
    <div class="q-pa-md" style="padding-top: 0">
      <div class="container_gay q-gutter-y-md" style="background-color: white">
        <Header />
        <div class="row" style=" align-items: center">
          <div class="col-12">
            <q-page-container>
              <router-view/>
            </q-page-container>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
import {defineComponent, ref} from 'vue'

import EssentialLink from 'src/shared/ui/EssentialLink.vue'


import ProductCard from 'src/widgets/ProductCard/ui/ProductCard.vue'
import DemoProductsGrid from 'src/widgets/DemoProductsGrid/ui/DemoProductsGrid.vue'

import Header from '../../../widgets/Header/ui/Header.vue'
import Footer from '../../../widgets/Footer/ui/Footer.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    DemoProductsGrid,
    ProductCard,
    EssentialLink,
    Header,
    Footer
  },

  data() {
    return {
      slide: 1,
      xer: false,
      linksList,
      leftDrawerOpen: false
    }
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
})
</script>

<style>
.container_gay {
  width: 100%;
  margin: 0 auto;
}

/* Responsive container breakpoints similar to Bootstrap */
@media (min-width: 576px) {
  .container_gay {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container_gay {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container_gay {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container_gay {
    max-width: 1140px;
  }
}

@media (min-width: 1400px) {
  .container_gay {
    max-width: 1320px;
  }
}
</style>
