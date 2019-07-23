<template>
  <v-container class="launcher-layout" fluid grid-list-xs>
    <v-layout row wrap>
      <v-flex d-flex xs2 sm2 md2 lg2>
        <v-card flat color="primary">
          <v-card-text>Img</v-card-text>
        </v-card>
      </v-flex>
      <v-flex class="launcher-brwoser-container" d-flex xs10 sm10 md10 lg10>
        <v-card flat color="primary">
          <v-card-text>Web view</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout column="" wrap>
      <v-flex d-flex xs12 sm12 md12 lg12>
          
      </v-flex>
    </v-layout>
    <v-layout class="launcher-controls-container" row wrap>
      <v-flex class="launcher-progress-list">
        Progress List
      </v-flex>
      <v-flex class="launcher-options-container" ml-2>
        Button
      </v-flex>
    </v-layout>
    <v-layout class="launcher-status-container" row wrap>
      <v-flex class="launcher-online-container">
        Statuses 1
      </v-flex>
      <v-flex class="launcher-copyrights-container">
        Statuses 2
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'launcher',
  data: () => ({
    lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`
  })
}
</script>
