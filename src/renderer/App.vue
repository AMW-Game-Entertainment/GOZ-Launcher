<template>
  <v-app id="inspire" app>
      <v-content app>
          <router-view></router-view>
      </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'goz-launcher'
}
</script>

<style lang="scss">
  @import '@/assets/sass/app.scss';
</style>

