import store from '@/store/index'
import types from '@/constants/types'

export default {
  updateConfig (config) {
    store.dispatch({
      type: types.UPDATE_CONFIG,
      config
    })
  },
  updateTotalInGameOnline (data) {
    store.dispatch({
      type: types.UPDATE_TOTAL_IN_GAME_ONLINE,
      payload: data
    })
  }
}
