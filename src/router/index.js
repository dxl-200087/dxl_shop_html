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
        },
      ]
    },
  ]
})
