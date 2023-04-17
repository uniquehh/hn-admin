import Vue from 'vue'
import VueRouter from 'vue-router'
import rootPage from '../views/rootPage.vue'

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
        path: '/myCustomer',
        name: 'myCustomer',
        meta: {
          isPublic:false
        },
        component: () => import('../views/customer/myCustomer.vue')
      },
      {
        path: '/personal',
        name: 'personal',
        meta: {
          isPublic:false
        },
        component: () => import('../views/user/personal.vue')
      }
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
  // console.log(isLogin,to,from)

  if (isLogin) {
    if(to.path==='/login'&&from.path!='/'){
      next({path:from.path,replace:true})
    }else if(to.path==='/login'&&from.path=='/'){
      next({path:'/index',replace:true});
    }else if(to.path==='/'){
      next({path:'/index',replace:true});
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
