import Vue from 'vue'
import {
  event as gaEvent
} from 'vue-analytics'

export default {
  /**
     * Get config
     */
  getConfig () {
    return Vue.$http.get('/api/v1/config').then(({
      data
    }) => data)
  },
  /**
     * Get total online
     */
  getTotalInGameOnline () {
    return Vue.$http.get('/api/v1/total-online-ingame').then(({
      data
    }) => {
      // track event
      gaEvent('game-users', 'total-online', 'amount', data.totalOnline)
      return data
    })
  }
}
