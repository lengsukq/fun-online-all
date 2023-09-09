<template>
  <div>
    我是about页面, {{ title }}{{ num }}
  </div>
  <button @click="num++">点击增加</button>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type:String,
    default:'父传子的默认值',
  },
  num:{
    type: Number,
    default: 0,
  }
})

</script>

<style scoped></style>
