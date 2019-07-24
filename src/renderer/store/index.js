import Vue from 'vue'
import Vuex from 'vuex'

import {
  createPersistedState
} from 'vuex-electron'

import getters from './getters'

Vue.use(Vuex)

const initialState = () => ({
  config: {
    gameLauncher: {}
  }
})

export default new Vuex.Store({
  state: initialState,
  mutations: {
    updateConfig(state, {
      config
    }) {
      state.config = config
    },
    reset(state) {
      // acquire initial state
      state = initialState()
    }
  },
  actions: {
    updateConfig(context, payload) {
      context.commit('updateConfig', payload)
    },
    reset(context, payload) {
      context.commit('reset', payload)
    }
  },
  plugins: [
    ...process.env.NODE_ENV === 'production' ? [
      createPersistedState()
    ] : []
    // createSharedMutations()
  ],
  getters,
  strict: process.env.NODE_ENV !== 'production'
})
