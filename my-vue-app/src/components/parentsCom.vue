<template>
    <AboutPage :title="message" :num="num"/>
</template>

<script setup lang="ts">
import AboutPage from './aboutview.vue'
import {ref} from "vue";

const message = '父传子666'
const num = ref(1);
</script>

<style scoped></style>
