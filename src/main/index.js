'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import childProcess from 'child_process'
import '../renderer/store'
import axios from 'axios'
import progress from 'progress-stream'
import { createWriteStream } from 'fs'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
// import { format } from 'url'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const CancelTokenSource = []
const url = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${join(__dirname, '/index.html')}`
function createWindow () {
  // Check for game updates
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 610,
    // useContentSize: true,
    // transparent: true,
    center: 1,
    resizable: false,
    // movable: false,
    frame: false,
    // titleBarStyle: 'hidden',
    width: 930,
    nodeIntegration: true,
    // webPreferences: {
    //   nodeIntegration: true,
    //   backgroundThrottling: false
    // },
    icon: join(__static, 'icon.png'),
    title: global.MIX_APP_NAME
  })
  console.log(global.MIX_APP_NAME, process.env.MIX_APP_NAME)
  mainWindow.loadURL(
    url
  )
  // Send version to renderer
  mainWindow.webContents.on('dom-ready', () => {
    ipcMain.once('cancel-request-token', () => {
      CancelTokenSource.map((cancelToken) => cancelToken.cancel('Canceling downloads'))
    })
    ipcMain.once('run-game', (event, { gameExe, clientPath }) => {
      childProcess.exec(`cd ${clientPath} && start ${gameExe} -rez gods.art -rez scp.art -rez goz.art -rez scp.art -rez script.art -rez models.art 127.0.0.1 -rez  .. -rez .`)
      app.quit()
    })
    ipcMain.on('download', (event, arg) => {
      const SourceToken = axios.CancelToken.source()
      CancelTokenSource.push(SourceToken)
      const CurrentToken = CancelTokenSource.indexOf(SourceToken)

      const str = progress({
        time: 100 /* ms */
      })

      const onResponse = (res) => {
        res.data.pipe(str).pipe(createWriteStream(arg.pathToLocal))

        str.on('progress', (progressEvent) => {
          event.sender.send('downloaded-progress', {
            percentage: Math.floor((progressEvent.transferred * 100) / res.headers['content-length'])
          })
          if (progressEvent.percentage === 100) {
            event.sender.send('downloaded-successful', arg)
          }
        })
      }
      const onError = () => event.sender.send('downloaded-failed', arg)

      axios({
        method: 'GET',
        url: arg.urlPath,
        responseType: 'stream',
        cancelToken: CurrentToken.token
      })
        .then(onResponse)
        .catch(onError)
    })
  })
  mainWindow.on('closed', () => {
    CancelTokenSource.map((cancelToken) => cancelToken.cancel('Canceling downloads'))
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  CancelTokenSource.map((cancelToken) => cancelToken.cancel('Canceling downloads'))
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

process.on('unhandledRejection', (error) => {
  console.error(error)
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
