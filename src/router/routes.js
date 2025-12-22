const routes = [
  {
    path: '/',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/product/:id',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'product',
        component: () => import('pages/DEMO/ProductPage.vue')
      }
    ]
  },
  {
    path: '/search/',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'search',
        component: () => import('pages/DEMO/ProductFilterPage.vue')
      }
    ]
  },
  {
    path: '/cart/',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'cart',
        component: () => import('pages/CartPage/index.vue')
      }
    ]
  },
  {
    path: '/checkout/',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'checkout',
        component: () => import('pages/CheckoutPage/CheckoutPage.vue')
      }
    ]
  },
  {
    path: '/orderMade/',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'order-made',
        component: () => import('pages/DEMO/OrderDonePage.vue')
      }
    ]
  },
  {
    path: '/orders/',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'orders',
        component: () => import('pages/DEMO/OrdersPage.vue')
      }
    ]
  },
  {
    path: '/order/:orderId',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'order',
        component: () => import('pages/DEMO/OrderPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/login',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/Auth/LoginPage.vue')
      }
    ]
  },
  {
    path: '/registration',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'registration',
        component: () => import('pages/Auth/RegistrationPage.vue')
      }
    ]
  },
  {
    path: '/forgotPassword',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'forgot-password',
        component: () => import('pages/Auth/ForgotPasswordPage.vue')
      }
    ]
  },
  {
    path: '/changePassword/:link',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'change-password',
        component: () => import('pages/Auth/ChangePasswordPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/activation/:link',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'activation',
        component: () => import('pages/Auth/AccountActivationPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/mail-sent',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'mail-sent',
        component: () => import('pages/Auth/MailSentPage.vue')
      }
    ]
  },
  {
    path: '/createProfile',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'create-profile',
        component: () => import('pages/Auth/CreateProfilePage.vue')
      }
    ]
  },
  {
    path: '/seller/products',
    component: () => import('src/widgets/LkSellerLayout/ui/LkSellerLayout.vue'),
    children: [
      {
        path: '',
        name: 'seller-products',
        component: () => import('pages/DEMO/LkSeller/ProductsList.vue')
      }
    ]
  },
  {
    path: '/seller/orders',
    component: () => import('src/widgets/LkSellerLayout/ui/LkSellerLayout.vue'),
    children: [
      {
        path: '',
        name: 'seller-orders',
        component: () => import('pages/DEMO/LkSeller/OrdersList.vue')
      }
    ]
  },
  {
    path: '/catalog',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'catalog',
        component: () => import('pages/CatalogPage.vue')
      }
    ]
  },
  {
    path: '/info',
    component: () => import('src/app/MainLayout/ui/MainLayout.vue'),
    children: [
      { 
        path: '', 
        name: 'info', 
        component: () => import('pages/InfoPage.vue') 
      }
    ]
  },
  {
    path: '/admin/shops',
    component: () => import('src/widgets/AdminLayout/ui/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-shops',
        component: () => import('pages/Admin/ShopsPage.vue')
      }
    ]
  },
  {
    path: '/admin/opps',
    component: () => import('src/widgets/AdminLayout/ui/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-opps',
        component: () => import('pages/Admin/OppsPage.vue')
      }
    ]
  },
  {
    path: '/shop/:id/edit',
    name: 'lk_seller_edit_shop',
    component: () => import('layouts/LkSellerLayout.vue'),
    children: [
      {path: '', component: () => import('pages/DEMO/LkSeller/EditShop.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
