import Vue from 'vue'
import VueRouter from 'vue-router'
import rootPage from '../views/rootPage.vue'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'rootPage',
    component: rootPage,
    meta: {
      isPublic:true
    },
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {
          isPublic:true
        },
        component: () => import('../views/index.vue')
      },
      {
        path: '/system/yiYuanUserAdmin',
        name: 'yiYuanUserAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/system/yiYuanUserAdmin.vue')
      },
      {
        path: '/system/powerAdmin',
        name: 'powerAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/system/powerAdmin.vue')
      },
      {
        path: '/system/dataDict',
        name: 'dataDict',
        meta: {
          isPublic:false
        },
        component: () => import('../views/system/dataDict.vue')
      },
      {
        path: '/system/staffAdmin',
        name: 'staffAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/system/staffAdmin.vue')
      },
      {
        path: '/system/groupAdmin',
        name: 'groupAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/system/groupAdmin.vue')
      },
      {
        path: '/system/customeAdmin',
        name: 'customeAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/system/customeAdmin.vue')
      },
      {
        path: '/myCustomer',
        name: 'myCustomer',
        meta: {
          isPublic:false
        },
        component: () => import('../views/customer/myCustomer.vue')
      },
      {
        path: '/customerInfo',
        name: 'customerInfo',
        meta: {
          isPublic:false
        },
        component: () => import('../views/customer/customerInfo.vue')
      },
      {
        path: '/cdAdmin',
        name: 'cdAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/cdAdmin/cdAdmin.vue')
      },
      {
        path: '/personal',
        name: 'personal',
        meta: {
          isPublic:false
        },
        component: () => import('../views/user/personal.vue')
      },
      {
        path: '/jieDanZhongXin',
        name: 'jieDanZhongXin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/jieDan/jieDanZhongXin.vue')
      },
      {
        path: '/paiDanAdmin',
        name: 'paiDanAdmin',
        meta: {
          isPublic:false
        },
        component: () => import('../views/paiDanAdmin/paiDanAdmin.vue')
      },
      {
        path: '/yiYuanPaiDan',
        name: 'yiYuanPaiDan',
        meta: {
          isPublic:false
        },
        component: () => import('../views/yiYuanPaiDan/yiYuanPaiDan.vue')
      },
      {
        path: '/customerRecb',
        name: 'customerRecb',
        meta: {
          isPublic:false
        },
        component: () => import('../views/customer/customerRecb.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      isPublic:true
    },
    component: () => import('../views/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let isLogin = window.localStorage.getItem('isLogin')
  let firstPath = store.state.firstPath.firstPath
  // console.log(to,from)

  if (isLogin) {
    if(to.path==='/login'&&from.path!='/'){
      next({path:from.path,replace:true})
    }else if(to.path==='/login'&&from.path=='/'){
      next({path:firstPath,replace:true});
    }else if(to.path==='/'){
      next({path:firstPath,replace:true});
    }else {
      next()
    }
  } else {
    if(to.path==='/login'){
      next({replace:true});
    }else{
      next({path:'/login',replace:true});
    }
  }

})

export default router
