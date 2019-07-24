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
                      <div class="caption">Checking...
                        <strong>{{ Math.ceil(checkingProgress) }}%</strong>
                    </div>
                  </v-flex>
                  <v-flex xs6 sm6 md6 lg6 align-center text-right>
                      <div class="caption">Total files: 5</div>
                  </v-flex>
                </v-layout>
                <v-progress-linear
                    :value="checkingProgress"
                    height="5"
                    color="accent"
                    striped
                    text-center
                    class="launcher-checking-progress"
                  >
                </v-progress-linear>
                <v-layout row ml-1 mr-1>
                  <v-flex xs12 sm12 md12 lg12 align-center text-left>
                      <div class="caption">Downloading...<strong>{{ Math.ceil(downloadingProgress) }}%</strong></div>
                  </v-flex>
                </v-layout>
                <v-progress-linear
                    :value="downloadingProgress"
                    height="5"
                    color="accent"
                    striped
                    text-center
                    class="launcher-downloading-progress"
                  >
                </v-progress-linear>
              </v-layout>
            </v-flex>
            <v-flex xs3 sm3 md3 lg3 align-center d-flex fill-height>
                <v-btn-toggle v-model="options" multiple>
                    <v-btn color="accent" block large>Play</v-btn>
                </v-btn-toggle>
            </v-flex>
          </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import config from '@/constants/config'

export default {
  name: 'launcher',
  data: () => ({
    checkingProgress: 5,
    downloadingProgress: 5,
    options: true
  }),
  computed: {
    mainSite: () => config.mainSite
  }
}
</script>
