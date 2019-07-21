const state = {
  inGame: {
    totalOnline: 0,
    totalOffline: 0
  }
}

const mutations = {
  UPDATE_TOTAL_ONLINE_AND_OFFLINE (state, {
    payload: {
      totalOnline,
      totalOffline
    }
  }) {
    state.inGame = {
      ...state.inGame,
      totalOnline,
      totalOffline
    }
  }
}

const actions = {
  updateTotalInGameOnline (context, payload) {
    context.commit('updateTotalInGameOnline', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
