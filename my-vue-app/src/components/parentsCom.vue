<template>
  <AboutPage :title="message" :num="num" @upDate="upDate"/>
</template>

<script setup lang="ts">
import AboutPage from './aboutview.vue'
import {ref} from "vue";

const message = '父传子已触发'
const num = ref(1);
const upDate = (value: String) => {
  console.log('父组件的upDate', num.value++, value)
}
</script>

<style scoped></style>
