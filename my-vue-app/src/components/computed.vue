<template>
  <div>{{ mul }}</div>
  <div @click="mul = 100">click</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
let price = ref<number | string>(1)//$0
let mul = computed({
  get: () => {
    return price.value
  },
  set: (value) => {
    console.log('value', value)
    price.value = 'set' + value
  }
})
</script>

<style>
</style>

