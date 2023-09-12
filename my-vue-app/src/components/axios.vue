<template>
<h3>axios 请求数据展示demo</h3>
  <ul v-for="item in data">
    <li>id:{{ item.id }}</li>
    <li>姓名:{{ item.name }}</li>
    <li>座右铭:{{ item.keywords }}</li>
    <li>手机号:{{ item.phone }}</li>
  </ul>
</template>

<script setup lang="ts">
import {getUniteLoginUrl} from "../api/api"
import {onMounted, reactive, ref} from "vue";


//第一种
const data = ref(null)
//第二种
//let books = reactive({
// list: []
// })
// books.list = response.data
onMounted(()=>{
  getUniteLoginUrl({}).then((res: any)=>{
    data.value = res;
    console.log('res',data);

  })
})
</script>

<style scoped>

</style>
