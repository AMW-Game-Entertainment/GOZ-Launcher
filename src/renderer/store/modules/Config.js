const state = {
  config: {
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
