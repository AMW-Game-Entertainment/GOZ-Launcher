import Request from '@/api/requests.js'
import actions from '@/store/actions'

export default class onLoad {
  /**
     * init App
     */
  initApp () {
    return Promise.all([
      // Get payments config
      Request.getConfig().then(config => {
        actions.updateConfig(config)
        return config
      }),
      Request.getTotalInGameOnline().then((data) => {
        actions.updateTotalInGameOnline(data)
        return data
      })
    ])
  }
  refresh () {
    return Promise.all([
      Request.getTotalInGameOnline().then((data) => {
        actions.updateTotalInGameOnline(data)
        return data
      })
    ])
  }
}
