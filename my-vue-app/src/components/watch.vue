<script setup lang="ts">
import {reactive, ref, watch, watchEffect} from "vue";

const user = reactive({
  firstName: '东方',
  lastName: '不败',
})

const name = ref('')
//watchEffect 也是一个帧听器，是一个副作用函数。 它会监听引用数据类型的所有属性，不需要具体到某个属性，一旦运行就会立即监听，组件卸载的时候会停止监听。
watchEffect((value) => {
  console.log('watchEffect', value)
  name.value = user.firstName + "-" + user.lastName
})

watch([() => user.firstName, () => user.lastName, name], (value) => {
  console.log('watch触发', value)
})

</script>

<template>
  <input type="text" v-model="user.firstName"> <br>
  <input type="text" v-model="user.lastName"> <br>
  <input type="text" v-model="name"> <br>
  <input type="text">
</template>

<style scoped>

</style>
