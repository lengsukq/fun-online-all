<script lang="ts" setup>
import {onMounted, ref} from "vue";
// 优先定义ref对象，否则后面无法取值
const refInput = ref(null)

onMounted(() => {
  if (refInput.value) {
    console.log('refInput存在')
    refInput.value?.focus();
  }
})
</script>

<template>
  <input ref="refInput" placeholder="自动获取焦点">
</template>

<style scoped>

</style>
