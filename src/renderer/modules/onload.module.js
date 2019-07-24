import Request from '@/api/requests.js'
import actions from '@/store/actions'

export default class onLoad {
  /**
     * init App
     */
  initApp () {
    actions.reset()

    return Promise.all([
      // Get payments config
      Request.getConfig().then((config) => {
        actions.updateConfig(config)
        return config
      })
    ])
  }
}
