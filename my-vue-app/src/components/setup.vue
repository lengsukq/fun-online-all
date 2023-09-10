<script setup lang="ts">
import {useRouter} from "vue-router";
// 通过router.currentRoute.value里的参数获取query params路由携带的参数
const router = useRouter()
console.log(router.currentRoute.value.query)
console.log(router.currentRoute.value.params)
console.log(router.currentRoute.value)

const props = defineProps()
console.log('props', props)
</script>

<template>
  <h3>{{ router.currentRoute.value.query }}</h3>
</template>

<style scoped>

</style>
