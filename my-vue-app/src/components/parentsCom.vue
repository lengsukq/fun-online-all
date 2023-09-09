<template>
  <div>
    <AboutPage  :title="message" :num="1"/>
  </div>

</template>

<script setup lang="ts">
import  AboutPage from './aboutview.vue'
const message = '父传子666'
const num = 1;
</script>

<style scoped></style>
