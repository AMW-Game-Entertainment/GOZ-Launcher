import store from '@/store'
import types from '@/constants/types'

export default {
  updateConfig (config) {
    store.dispatch({
      type: types.UPDATE_CONFIG,
      config
    })
  },
  downloadProgress (payload) {
    store.dispatch({
      type: types.DOWNLOADING_PROGRESS,
      payload
    })
  },
  reset () {
    store.dispatch({
      type: types.RESET
    })
  }
}
