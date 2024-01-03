<template>
  <h3 :style="{color}">孙子组件: {{ color }}{{ name }}</h3>

</template>

<script lang="ts">
import {inject} from 'vue'

export default {
  setup() {
    const color = inject<string>('color')
    const name = inject<string>('name')
    return {
      color,
      name
    }
  }
}
</script>
