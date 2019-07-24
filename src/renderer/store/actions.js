import store from '@/store'
import types from '@/constants/types'

export default {
  updateConfig (config) {
    store.dispatch({
      type: types.UPDATE_CONFIG,
      config
    })
  },
  reset () {
    store.dispatch({
      type: types.RESET
    })
  }
}
