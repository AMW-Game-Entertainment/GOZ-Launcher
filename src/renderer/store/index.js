import Vue from 'vue'
import Vuex from 'vuex'

import {
  createPersistedState
} from 'vuex-electron'

Vue.use(Vuex)

const initialState = () => ({
  config: {
    gameLauncher: {}
  },
  progress: {
    downloading: {
      at: 0,
      filePath: '',
      error: false,
      done: false
    }
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
    downloadProgress(state, {
      payload
    }) {
      state.progress.downloading = {
        ...state.progress.downloading,
        ...payload
      }
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
    downloadProgress(context, payload) {
      context.commit('downloadProgress', payload)
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
  strict: process.env.NODE_ENV !== 'production'
})
