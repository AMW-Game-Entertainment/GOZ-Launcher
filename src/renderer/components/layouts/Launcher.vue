<template>
  <v-container class="launcher-layout" fluid pt-0 pb-0>
    <v-layout class="launcher-center" row wrap>
      <v-flex class="launcher-brwoser-container" d-flex xs12 sm12 md12 lg12>
        <webview id="webview" class="launcher-webview" :src="mainSite"></webview>
      </v-flex>
    </v-layout>
    <v-layout class="launcher-bottom" column>
      <v-layout class="launcher-controls-container" row wrap>
        <v-flex xs9 sm9 md9 lg9 d-flex fill-height>
          <v-layout column class="pa-2">
            <v-layout row ml-1 mr-1>
              <v-flex xs6 sm6 md6 lg6 align-center text-left>
                <div class="caption white--text">
                  Checking...
                  <strong>{{ checkingProgress }}%</strong>
                </div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6 align-center text-right>
                <div class="caption white--text">Total files: {{ filesToBeDownloaded.length }}</div>
              </v-flex>
            </v-layout>
            <v-progress-linear
              :value="checkingProgress"
              height="5"
              color="accent"
              striped
              text-center
              class="launcher-checking-progress"
            ></v-progress-linear>
            <v-layout row ml-1 mr-1>
              <v-flex xs12 sm12 md12 lg12 align-center text-left>
                <div class="caption white--text">
                  {{ downloadingLabel }}
                </div>
              </v-flex>
            </v-layout>
            <v-progress-linear
              :value="downloadingProgress.at"
              height="5"
              color="accent"
              striped
              text-center
              class="launcher-downloading-progress"
            ></v-progress-linear>
          </v-layout>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3 align-center d-flex fill-height>
          <v-card flat tile class="launcher-options">
            <v-card-actions class="launcher-options-list">
              <v-btn v-if="!playButtonClciked" @click="onPlay()" color="secondary" block large>Play</v-btn>
              <v-btn v-if="playButtonClciked" color="accent" block large>Play</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import fs from 'fs'
import { fromFile as fromFileHash } from 'hasha'
import { basename, join } from 'path'
import requests from '@/api/requests'
import { getConfig, getDownloadingProgress } from '@/store/selectors'
import config from '@/constants/config'
import actions from '@/store/actions'
// import ProgressUtil from '@/utils/Progress.utils'

export default {
  name: 'launcher',
  mounted() {
    this.$electron.ipcRenderer.on('downloaded-progress', (event, { percentage = 0 }) => {
      this.downloadingLabel = `Downloading...${this.downloadingProgress.filePath} | ${percentage}%`
      actions.downloadProgress({
        at: percentage
      })
    })
    this.$electron.ipcRenderer.on('downloaded-failed', (event, arg) => {
      this.downloadingLabel = `Unable to download ${this.downloadingProgress.filePath}...`
      this.filesToBeDownloaded.splice(this.filesToBeDownloaded.indexOf(this.ServerFileInfo(this.downloadingProgress.filePath)), 1)
      actions.downloadProgress({
        at: 100,
        error: false,
        done: true
      })// download next file
      setTimeout(() => this.DownloadFiles(), 500)
    })
    this.$electron.ipcRenderer.on('downloaded-successful', (event, arg) => {
      this.downloadingLabel = `${this.downloadingProgress.filePath} Completed`
      this.filesToBeDownloaded.splice(this.filesToBeDownloaded.indexOf(this.ServerFileInfo(this.downloadingProgress.filePath)), 1)
      actions.downloadProgress({
        at: 100,
        error: false,
        done: true
      })
      // download next file
      setTimeout(() => this.DownloadFiles(), 500)
    })
  },
  data: () => ({
    checkingProgress: 5,
    filesToBeDownloaded: [],
    filesOnServer: [],
    filesOnLocal: [],
    downloadingLabel: '',
    playButtonClciked: false
  }),
  computed: {
    ...mapState({
      config: (state) => getConfig(state, 'gameLauncher'),
      downloadingProgress: (state) => getDownloadingProgress(state)
    }),
    mainSite: () => config.mainSite
  },
  methods: {
    /**
     * On play btn clicked
     */
    onPlay() {
      // play button clicked
      this.playButtonClciked = true
      // cancel all previous tokens requests
      this.$electron.ipcRenderer.send('cancel-request-token')
      // First get svr files that can be downloaded
      this.getServerFiles()
        .then((files) => {
          this.filesOnServer = files
          this.filesToBeDownloaded = files
          return this.CheckNotExistingDir()
        })
        // Get local files
        .then(() => this.refatorFilesPath(this.getFilePaths(config.appGameClientPath)))
        // Compare file with local files
        .then((localFiles) => {
          this.filesOnLocal.push(localFiles)
          this.CompareFilesWithLocal()
        })
    },
    /**
     * Get server files list that are allowed to be downloaded
     */
    getServerFiles() {
      return requests
        .getDownloadList(this.config.checkHashshUrl)
        .then((filesOnServer) => {
          // Let's setup our files paths taken from svr
          return filesOnServer
            .split('\n')
            .map((fileAndFile) => {
              const filePath = fileAndFile.split(',')[0]
              const sum = fileAndFile.split(',')[1]
              return {
                pathToFile: filePath,
                fileName: basename(filePath),
                urlPath: `${config.launcherFilesEndpoint}${filePath}`,
                sum
              }
            })
        })
    },
    /**
     * Compare the hashsum between local and svr file
     */
    async Compare(filePath, sum) {
      const localFileHash = String(await fromFileHash(filePath, {algorithm: 'sha1'})).trim()
      return {
        valid: localFileHash === String(sum).trim(),
        localFileHash,
        ServerFileHash: sum
      }
    },
    /**
     * From server get file info
     */
    ServerFileInfo(filePath) {
      return this.filesOnServer
        .find((fileInfo) => fileInfo.pathToFile === filePath) || {}
    },
    /**
     * Get folder and files
     */
    getFilePaths(folderPath) {
      const entryPaths = fs.readdirSync(folderPath).map((entry) => join(folderPath, entry))
      const filePaths = entryPaths.filter((entryPath) => fs.statSync(entryPath).isFile())
      const dirPaths = entryPaths.filter((entryPath) => !filePaths.includes(entryPath))
      const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(this.getFilePaths(curr)), [])
      return [...filePaths, ...dirFiles, ...dirPaths]
    },
    /**
     * Refactor the files path
     */
    refatorFilesPath(files) {
      return files.map((path) => path.replace(`${config.appGameClientPath}\\`, '', path))
    },
    /**
     * Check if dirs exist, if not create
     */
    CheckNotExistingDir() {
      this.filesOnServer.forEach((fileInfo) => {
        // get path
        const fileFullPath = join(config.appGameClientPath, fileInfo.pathToFile)
        // get dir
        const dir = fileFullPath.replace(basename(fileFullPath), '', fileFullPath)
        // check if found dir and doesnt exist
        if (dir && !fs.existsSync(dir)) {
          // create
          fs.mkdirSync(dir)
        }
      })
    },
    /**
     * Compare server files with local files
     */
    CompareFilesWithLocal() {
      // check if any files
      if (this.filesOnLocal[0].length) {
        console.log(this.filesOnLocal[0])
        let currentItem = 0
        // each file
        this.filesOnLocal[0].forEach(async (file, index) => {
          currentItem++
          // full path to client and file
          const fullPath = `${config.appGameClientPath}\\${file}`
          const fileInfo = this.ServerFileInfo(file)
          // extract sum
          const { sum } = fileInfo
          if (!sum) {
          // get the stat to know if deleteing file
            // if (fs.lstatSync(fullPath).isFile()) {
            // // delete this local file
            //   fs.unlinkSync(fullPath)
            // }
            if (currentItem === this.filesOnLocal.length) {
              this.DownloadFiles()
            }
          } else {
            this.Compare(fullPath, sum)
              .then(({ valid, localFileHash, ServerFileHash }) => {
                // than check if valid - means up to date
                console.log(valid, localFileHash, ServerFileHash, this.filesToBeDownloaded.indexOf(fileInfo))
                // than remove it from downloadable files list if hash is valid
                if (valid) {
                  this.filesToBeDownloaded.splice(this.filesToBeDownloaded.indexOf(fileInfo), 1)
                }
                if (currentItem === this.filesOnLocal.length) {
                  this.DownloadFiles()
                }
              })
          }
        })
      }
    },
    /**
     * Download files from the list, one at a time
     */
    DownloadFiles() {
      if (this.filesToBeDownloaded.length) {
        const fileInfo = this.filesToBeDownloaded[0]
        const pathToLocal = join(config.appGameClientPath, fileInfo.pathToFile)
        actions.downloadProgress({
          filePath: fileInfo.pathToFile,
          at: 0,
          error: false,
          done: false
        })
        this.$electron.ipcRenderer.send('download', {
          urlPath: fileInfo.urlPath,
          pathToLocal
        })
      }
    }
  }
}
</script>
