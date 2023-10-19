<template>
  <div class="about">
    hello文件
    <h1>{{ message }}</h1>
    <h1>{{ message.length > 5 ? "一高" : "一快" }}</h1>
    <h1>{{ message + "运算符" }}</h1>
    <h1>{{ message.split("").reverse() }}</h1>
  </div>
</template>
<script lang="ts" setup>
const message = "文本插值语法";

</script>

<style scoped>

</style>
