import Request from '@/api/requests.js'
import actions from '@/store/actions'
import store from '@/store/index'

export default class onLoad {
  /**
     * init App
     */
  initApp () {
    let loggedReqs = []

    if (store.getters.isLogged()) {
      loggedReqs = [
        Request.getNotifications()
          .then((notifications) => {
            actions.updateNotifications(notifications)
            return notifications
          })
      ]
    }

    Request.getAuthUser().then(user => {
      actions.updateUser(user)
      return user
    })

    const reqs = [
      // Get payments config
      Request.getConfig().then(config => {
        actions.updateConfig(config)
        return config
      }),
      Request.getTotalInGameOnline().then((data) => {
        actions.updateTotalInGameOnline(data)
        return data
      }),
      ...loggedReqs
    ]

    return Promise.all(reqs)
  }
  refresh () {
    let loggedReqs = []
    if (store.getters.isLogged()) {
      loggedReqs = [
        Request.getNotifications()
          .then((notifications) => {
            actions.updateNotifications(notifications)
            return notifications
          })
      ]
    }
    const reqs = [
      Request.getTotalInGameOnline().then((data) => {
        actions.updateTotalInGameOnline(data)
        return data
      }),
      ...loggedReqs
    ]

    return Promise.all(reqs)
  }
}
