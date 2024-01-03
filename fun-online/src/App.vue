<script lang="ts" setup>
import myFloatingPanel from './pages/studyBySelf/FloatingPanel.vue';
import { useRoute } from 'vue-router';
import {onUpdated, ref} from "vue";
import '@vant/touch-emulator';
const isShowPanel = ref(true)
onUpdated(()=>{
  console.log('userRoute--app',useRoute().meta,useRoute().path);
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <myFloatingPanel  :is="Component"  v-if="$route.meta.isShowPanel"></myFloatingPanel>
    <component :is="Component"/>
  </router-view>


</template>
<style scoped>

</style>
