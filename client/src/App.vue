<template>
  <div id="app">
    <Stats />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Stats from './components/Stats.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Stats,
  },
});
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  font-family: 'IBM Plex Mono', monospace;
  background: #1c1c1c;
  color: #eeeeee;
  margin: 0 auto;
  padding: 0;
  max-width: 1200px;
  margin-bottom: 130px;
}
</style>
