<script lang="ts" setup>
import myFloatingPanel from './pages/studyBySelf/FloatingPanel.vue'
</script>

<template>
  <myFloatingPanel></myFloatingPanel>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>


</template>

<style scoped>

</style>
