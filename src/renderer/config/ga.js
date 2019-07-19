import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import config from '@/config/config'
import router from '@/router/index'

Vue.use(VueAnalytics, {
  id: config.gaId,
  router,
  debug: {
    enabled: false, // default value
    trace: false, // default value
    sendHitTask: false // default value
  },
  autoTracking: {
    screenview: true,
    skipSamePath: true
  },
  ecommerce: {
    enabled: true,
    enhanced: true
  },
  commands: {
    // Usage only on a template directly
    track (category, action, field, value) {
      this.$ga.event(category, action, field, value)
    }
  }
})
