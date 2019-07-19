import VuetifyToast from 'vuetify-toast-snackbar'
import Vue from 'vue'

Vue.use(VuetifyToast, {
  x: 'right', // default
  y: 'bottom', // default
  color: 'darkgray', // default
  icon: 'info',
  classes: [
    'body-2'
  ],
  timeout: 5000, // default
  dismissable: true, // default
  autoHeight: true, // default
  multiLine: true, // default
  vertical: false, // default
  queueable: true, // default
  showClose: true, // default
  shorts: {
    custom: {
      color: 'darkgray'
    }
  },
  property: '$toast' // default
})
