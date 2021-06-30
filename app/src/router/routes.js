
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // dashboard does not need a login to view the page
      { path: '', name: 'dashboard', component: () => import('pages/Dashboard.vue') }
    ]
  },

  {
    path: '/people',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'people.index', component: () => import('pages/people/Index.vue') }
    ]
  },

  {
    path: '/attachments',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'attachments.index', component: () => import('pages/attachments/Index.vue') },
      { path: 'add', name: 'attachments.add', component: () => import('pages/attachments/Form.vue') }
    ]
  },

  {
    path: '/server-error',
    component: () => import('pages/Error500.vue'),
    name: 'error.500',
    meta: { auth: false }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
    meta: { auth: false }
  }
]

export default routes
