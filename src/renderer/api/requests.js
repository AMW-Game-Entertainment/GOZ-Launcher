import axios from 'axios'
import request from 'request'
import progress from 'request-progress'
import {
  event as gaEvent
} from 'vue-analytics'
import config from '@/constants/config'

export default {
  /**
   * Get config
   */
  getConfig() {
    return axios.get(config.endpoint + '/api/v1/config').then(({
      data
    }) => data)
  },
  /**
   * Get total online
   */
  getTotalInGameOnline() {
    return axios.get(config.endpoint + '/api/v1/total-online-ingame').then(({
      data
    }) => {
      // track event
      gaEvent('game-users', 'total-online', 'amount', data.totalOnline)
      return data
    })
  },
  /**
   * Get downloads list
   */
  getDownloadList(url) {
    return axios.get(url)
      .then(({
        data
      }) => {
        // track event
        gaEvent('downloads', 'launcher-files', 'list', data)
        return data
      })
  },
  downloadAsStream(fileSvrPath) {
    // eslint-disable-next-line no-return-await
    return progress(request.get(fileSvrPath, {
      /* GZIP true for most of the websites now, disable it if you don't need it */
      gzip: true
    }), {
      throttle: 60000, // Throttle the progress event, defaults to 1000ms
      delay: 0 // Only start to emit after a delay of some milliseconds - default is 0ms
    })
  }
}
