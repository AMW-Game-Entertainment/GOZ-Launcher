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
                  <strong>{{ Math.ceil(checkingProgress) }}%</strong>
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
                  <strong>{{ downloadingProgress.at > 0 ? `${Math.ceil(downloadingProgress.at)}%` : '' }}</strong>
                </div>
              </v-flex>
            </v-layout>
            <v-progress-linear
              :value="Math.ceil(downloadingProgress.at)"
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
              <v-btn @click="onPlay()" color="secondary" block large>Play</v-btn>
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

export default {
  name: 'launcher',
  data: () => ({
    checkingProgress: 5,
    filesToBeDownloaded: [],
    filesOnServer: [],
    filesOnLocal: []
  }),
  computed: {
    ...mapState({
      config: (state) => getConfig(state, 'gameLauncher'),
      downloadingProgress: (state) => getDownloadingProgress(state)
    }),
    downloadingLabel() {
      if (this.downloadingProgress.at === 0) {
        return `--`
      }
      if (this.downloadingProgress.error) {
        this.DownloadFiles()
        return `Unable to download the file...`
      } else if (this.downloadingProgress.done) {
        this.DownloadFiles()
        return `Completed`
      }
      return `Downloading...${this.downloadingProgress.filePath}`
    },
    mainSite: () => config.mainSite
  },
  methods: {
    /**
     * On play btn clicked
     */
    onPlay() {
      // First get svr files that can be downloaded
      this.getServerFiles()
        .then((files) => {
          this.filesOnServer = files
          this.filesToBeDownloaded = files
        })
        // Get local files
        .then(() => {
          return this.refatorFilesPath(this.getFilePaths(config.appGameClientPath))
        })
        // Compare file with local files
        .then((localFiles) => {
          this.filesOnLocal.push(localFiles)
          return this.CompareFilesWithLocal()
        })
        .then(() => this.DownloadFiles())
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
      return {
        valid: await fromFileHash(filePath, {algorithm: 'sha1'}) === sum
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
     * Compare server files with local files
     */
    async CompareFilesWithLocal() {
      // check if any files
      if (this.filesOnLocal[0].length) {
        // each file
        await this.filesOnLocal[0].forEach((file) => {
          const fullPath = `${config.appGameClientPath}\\${file}`
          // get our current file from svr obj
          const fileInfo = this.ServerFileInfo(file)
          // extract sum
          const { sum } = fileInfo
          // if sum exist
          if (sum) {
            // comparing the hash of current local file with file on svr
            this.Compare(fullPath, sum).then(({ valid }) => {
              // than check if valid - means up to date
              if (valid) {
                // than remove it from downloadable files list
                this.filesToBeDownloaded.splice(this.filesToBeDownloaded.indexOf(fileInfo), 1)
              }
            })
          // else means this file is deprecated and must be deleted
          } else {
            // get the stat to know if deleteing a dir or file
            const fileStat = fs.lstatSync(fullPath)
            // delete this local file/dir
            if (fileStat.isDirectory()) {
              fs.rmdirSync(fullPath)
            } else if (fileStat.isFile()) {
              fs.unlinkSync(fullPath)
            }
          }
        })
      }
    },
    DownloadFiles() {
      if (this.filesToBeDownloaded.length) {
        let downloaded = 0
        const fileInfo = this.filesToBeDownloaded[0]
        const pathToLocal = `${config.appGameClientPath}\\${fileInfo.filePath}`
        actions.downloadProgress({
          at: downloaded,
          filePath: fileInfo.filePath,
          error: false,
          done: false
        })
        requests.downloadAsStream(fileInfo.urlPath, pathToLocal)
          .then((response) => {
            response.data.pipe(fs.createWriteStream(pathToLocal))
            // const totalSize = (response.headers['content-length'] * 100) / 100
            response.data.on('data', (data) => {
              downloaded += (Buffer.byteLength(data) * 100) / 100
              actions.downloadProgress({
                at: downloaded,
                fullPath: fileInfo.filePath,
                error: false,
                done: false
              })
            })
            response.data.on('end', () => {
              actions.downloadProgress({
                at: 100,
                fullPath: fileInfo.filePath,
                error: false,
                done: true
              })
              this.filesToBeDownloaded.splice(0, 1)
            })
            response.data.on('error', () => {
              actions.downloadProgress({
                at: 100,
                fullPath: fileInfo.filePath,
                error: true,
                done: false
              })
              this.filesToBeDownloaded.splice(0, 1)
            })
          })
          .catch(() => {
            actions.downloadProgress({
              at: 100,
              fullPath: fileInfo.filePath,
              error: true,
              done: false
            })
            this.filesToBeDownloaded.splice(0, 1)
          })
      }
    }
  }
}
</script>
