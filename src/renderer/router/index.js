import Vue from 'vue'
import Router from 'vue-router'
import Launcher from '@/components/layouts/Launcher'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'launcher',
      component: Launcher
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
