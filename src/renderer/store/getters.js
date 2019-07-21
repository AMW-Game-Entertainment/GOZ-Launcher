import {
  getConfig
} from '@/store/selectors'

export default {
  config: (state) => (configName) =>
    getConfig(state, configName)
}
