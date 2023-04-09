import Vue from 'vue'
import VueRouter from 'vue-router'
import rootPage from '../views/rootPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'rootPage',
    component: rootPage,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import('../views/index.vue')
      },
      {
        path: '/system/yiYuanUserAdmin',
        name: 'yiYuanUserAdmin',
        component: () => import('../views/system/yiYuanUserAdmin.vue')
      },
      {
        path: '/system/powerAdmin',
        name: 'powerAdmin',
        component: () => import('../views/system/powerAdmin.vue')
      },
      {
        path: '/system/dataDict',
        name: 'dataDict',
        component: () => import('../views/system/dataDict.vue')
      },
      {
        path: '/system/staffAdmin',
        name: 'staffAdmin',
        component: () => import('../views/system/staffAdmin.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
