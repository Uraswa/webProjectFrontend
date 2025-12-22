const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/product/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/ProductPage.vue') }
    ]
  },
  {
    path: '/search/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/ProductFilterPage.vue') }
    ]
  },
  {
    path: '/cart/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/CartPage.vue') }
    ]

  },
  {
    path: '/checkout/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/CheckoutPage.vue') }
    ]
  },
  {
    path: '/orderMade/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/OrderDonePage.vue') }
    ]
  },
  {
    path: '/orders/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/OrdersPage.vue') }
    ]
  },
  {
    path: '/order/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/OrderPage.vue') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/LoginPage.vue') }
    ]
  },
  {
    path: '/registration',
    name: 'registration',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/RegistrationPage.vue') }
    ]
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/ForgotPasswordPage.vue') }
    ]
  },
  {
    path: '/changePassword/:link',
    name: 'changePassword',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/ChangePasswordPage.vue') }
    ]
  },
  {
    path: '/activation/:link',
    name: 'activation',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/AccountActivationPage.vue') }
    ]
  },
  {
    path: '/mail-sent',
    name: 'mailSent',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/MailSentPage.vue') }
    ]
  },

  {
    path: '/seller/products',
    name: 'lk_seller_products',
    component: () => import('layouts/LkSellerLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/LkSeller/ProductsList.vue') }
    ]
  },
  {
    path: '/seller/orders',
    name: 'lk_seller_orders',
    component: () => import('layouts/LkSellerLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DEMO/LkSeller/OrdersList.vue') }
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
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
