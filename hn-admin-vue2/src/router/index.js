import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    children: [
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
