import { remote } from 'electron'
import { resolve } from 'path'

export default {
  appName: process.env.MIX_APP_NAME,
  gaId: process.env.MIX_GA_ID,
  endpoint: process.env.API_ENDPOINT,
  mainSite: process.env.MAIN_SITE,
  launcherFilesEndpoint: process.env.LAUNCHER_FILES_ENDPOINT,
  appPath: process.env.NODE_ENV === 'production' ? remote.app.getAppPath() : resolve(__dirname, '../')
}
