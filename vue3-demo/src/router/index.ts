//引入路由
import { createRouter, createWebHashHistory } from 'vue-router'

//定义路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/TestView.vue')
  },
  {
    path: '/mainbox',
    name: 'mainbox',
    component: () => import('../views/MainBox.vue'),
    children: [
      {
        // /mainbox/index
        path: '/index',
        component: () => import('../views/GeneralView.vue')
      },
      {
        path: '/Photovoltaicequipment/DeviceType',
        component: () => import('../views/Photovoltaicequipment/DeviceType.vue')
      }
    ]
  },

]

//创建路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => {
    history.pushState(null, document.URL)
  }
})

export default router