<script lang="ts" setup>
import myFloatingPanel from './pages/studyBySelf/FloatingPanel.vue'
</script>

<template>
  <myFloatingPanel></myFloatingPanel>

  <keep-alive>
    <router-view></router-view>
  </keep-alive>

</template>

<style scoped>

</style>
