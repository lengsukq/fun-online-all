<script lang="ts" setup>
// 获取鼠标坐标的hook函数
import useMousePosition from "../../hook/useMousePosition.ts";

const {x, y} = useMousePosition();


</script>

<template>
  <h3>鼠标位置</h3>
  <h3>X轴：{{ x }}，Y轴：{{ y }}</h3>
</template>

<style scoped>

</style>
