
import Vue from 'vue'
import Vuetify from 'vuetify'

// Load Plugins
export default Vue.use(Vuetify, {
  iconfont: 'faSvg',
  icon: {
    cancel: 'fa-times-circle',
    close: 'fa-times-circle',
    delete: 'fa-times-circle', // delete (e.g. v-chip close)
    success: 'fa-check-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation',
    error: 'fa-exclamation-triangle',
    previous: 'fa-chevron-left',
    next: 'fa-chevron-right',
    checked: 'fa-check-square',
    unchecked: 'far fa-square',
    indeterminate: 'fa-minus-square',
    dot: 'fa-circle', // for carousel
    sort: 'fa-sort-up',
    expand: 'fa-chevron-down',
    append: 'fa-keyboard_arrow_down',
    subgroup: 'fa-caret-down'
  },
  options: {
    customProperties: true
  },
  theme: {
    primary: '#3a3a3a',
    secondary: '#353535 ', // '#8597c3',
    accent: '#578dbf',
    error: '#d43800',
    warning: '#f87b00',
    info: '#53abd0',
    success: '#aad79b'
  }
})
