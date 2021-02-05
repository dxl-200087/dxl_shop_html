import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Show'
    }, {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/Show',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Show.vue'),
          meta: { title: '系统首页' }
        },{
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '类型管理' }
        },{
          path: '/ShopData',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/ShopData.vue'),
          meta: { title: '品牌管理' }
        },{
          path: '/ShopProperty',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/ShopProperty.vue'),
          meta: { title: '属性管理' }
        },{
          path: '/Commodity',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Commodity.vue'),
          meta: { title: '商品注册' }
        },{
          path: '/QueryComm',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/QueryComm.vue'),
          meta: { title: '商品管理' }
        },{
          path: '/User',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/user/User.vue'),
          meta: { title: '用户管理' }
        },{
          path: '/Role',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/user/Role.vue'),
          meta: { title: '权限管理' }
        },{
          path: '/Persona',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/user/Persona.vue'),
          meta: { title: '角色管理' }
        },
      ]
    },{
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    }
  ]
})
