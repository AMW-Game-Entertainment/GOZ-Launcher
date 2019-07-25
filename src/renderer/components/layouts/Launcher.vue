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
                  Downloading...
                  <strong>{{ Math.ceil(downloadingProgress) }}%</strong>
                </div>
              </v-flex>
            </v-layout>
            <v-progress-linear
              :value="downloadingProgress"
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
// import Vue from 'vue'
import { mapState } from 'vuex'
import fs from 'fs'
import { basename } from 'path'
import walkdir from 'walkdir'
import crypto from 'crypto'
import requests from '@/api/requests'
import { getConfig } from '@/store/selectors'
import config from '@/constants/config'

export default {
  name: 'launcher',
  data: () => ({
    checkingProgress: 5,
    downloadingProgress: 5,
    filesToBeDownloaded: [],
    filesOnServer: [],
    filesOnLocal: []
  }),
  computed: {
    mainSite: () => config.mainSite,
    ...mapState({
      config: (state) => getConfig(state, 'gameLauncher')
    })
  },
  methods: {
    onPlay() {
      // First get svr files that can be downloaded
      this.getServerFiles()
        .then((files) => {
          this.filesOnServer = files
          this.filesToBeDownloaded = files
        })
        .then(() => this.CompareFilesWithLocal())
    },
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
                file: basename(filePath),
                path: `${config.launcherFilesEndpoint}${filePath}`,
                sum
              }
            })
        })
    },
    Compare(filePath, sum) {
      const localFileStream = fs.createReadStream(filePath)
      const hash = crypto.createHmac('sha1')
      hash.setEncoding('hex')
      localFileStream.on('end', () => {
        hash.end()
        hash.read()
      })
      return localFileStream.pipe(hash) === sum
    },
    fromServer(filePath) {
      const fileName = basename(filePath)
      return this.filesOnServer
        .find((fileInfo) => fileInfo.file === fileName)
    },
    async CompareFilesWithLocal() {
      const clientPath = `${config.appPath}\\client`
      this.filesOnLocal.push(await walkdir.async(clientPath))
      if (this.filesOnLocal[0].length) {
        this.filesOnLocal[0].forEach((file) => {
          console.log(file)
          const fileInfo = this.fromServer(file)
          console.log(this.Compare(file, fileInfo.sum))
          if (fileInfo && this.Compare(file, fileInfo.sum)) {
            this.filesToBeDownloaded.splice(this.filesToBeDownloaded.indexOf(fileInfo), 1)
          }
          console.log(this.filesToBeDownloaded.length, this.filesToBeDownloaded.indexOf(fileInfo))
        })
      }
    }
  }
}
</script>
