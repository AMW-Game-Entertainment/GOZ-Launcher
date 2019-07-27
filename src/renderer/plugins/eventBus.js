
import Vue from 'vue'
// ====================== //
// eventBuss
// ====================== //
Vue.prototype.$eventBus = new Vue() // add this line of code
// ====================== //
// Usage::
// Send  this.$eventBus.$emit('send-data', data);
// Receiver this.$eventBus.$on('send-data', (data) => {});
// Remove listener this.$eventBus.$off('send-data')
// Remove all this.$eventBus.$off()
// ====================== //
