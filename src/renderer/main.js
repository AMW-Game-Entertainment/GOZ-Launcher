import Vue from 'vue'
import axios from 'axios'

import App from '@/App'
import router from '@/router'
import store from '@/store'
import VeeValidate from 'vee-validate'
import '@/plugins/vuetify.js'
import '@/plugins/ga'
// import '@/plugins/toastify'
import OnLoad from '@/modules/onload.module.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/pro-solid-svg-icons'
import {far} from '@fortawesome/pro-regular-svg-icons'
import {fal} from '@fortawesome/pro-light-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(fas, far, fal) // Include needed icons.

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VeeValidate, {
  inject: false
})

// Global components
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* eslint-disable no-new */
const onLoad = new OnLoad()
export const app = onLoad
  .initApp()
  .then(() => {
    setInterval(() => onLoad.refresh(), 8000)
  })
  .then(() =>
    new Vue({
      components: { App },
      router,
      store,
      template: '<App/>'
    }).$mount('#app'))
