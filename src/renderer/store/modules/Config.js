const state = {
  config: {
    payments: {
      cost: [],
      statuses: [],
      recommended: 0,
      multiplePointsBy: 0,
      currency: ''
    },
    paygol: {
      recommended_method: ''
    },
    gameLauncher: {}
  }
}

const mutations = {
  updateConfig (state, {
    config
  }) {
    const newConfig = {
      ...state.config,
      ...config
    }
    state.config = newConfig
  }
}

const actions = {
  updateConfig (context, payload) {
    context.commit('updateConfig', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
