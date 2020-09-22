import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/setting'),
    children: [
      {
        path: 'keySetting',
        name: 'keySetting',
        component: () => import('../views/setting/keySetting')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
