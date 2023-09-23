<script setup lang="ts">
import {onMounted, ref} from "vue";
// 优先定义ref对象，否则后面无法取值
const refInput = ref<HTMLElement | null>()
const InputValue = ref('海菲我妻')
// 能获取到dom，但无法操作dom
console.log('setup-refInput',refInput)
try {
  refInput.value.focus();
}catch (e){
  console.error(e)
}

onMounted(() => {
  if (refInput.value) {
    console.log('refInput存在',refInput)
    refInput.value.focus();
  }
})
</script>

<template>
  <input placeholder="自动获取焦点" ref="refInput" v-model="InputValue">
  <br>
  <button @click="InputValue=InputValue==='海菲我老婆'?'海菲我妻':'海菲我老婆'">点击更换</button>
</template>

<style scoped>

</style>
