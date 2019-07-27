'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import '../renderer/store'
import axios from 'axios'
import fs from 'fs'
import adapter from 'axios/lib/adapters/http'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 610,
    useContentSize: true,
    transparent: true,
    center: 1,
    resizable: false,
    movable: false,
    frame: false,
    titleBarStyle: 'hidden',
    width: 930,
    nodeIntegration: true,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    }
  })

  mainWindow.loadURL(winURL)

  // Send version to renderer
  mainWindow.webContents.on('dom-ready', () => {
    ipcMain.on('download', (event, arg) => {
      console.log('download event', arg) // prints "ping"
      event.sender.send('downloaded', 'pong')
      axios.get(arg.urlPath, {
        onDownloadProgress: (progressEvent) => {
          event.sender.send('downloaded-progress', progressEvent)
        },
        responseType: 'stream',
        adapter
      })
        .then((res) => {
          res.data.pipe(fs.createWriteStream(arg.pathToLocal))
          event.sender.send('downloaded-successful', arg)
        })
        .catch(() => {
          event.sender.send('downloaded-failed', arg)
        })
    })
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
