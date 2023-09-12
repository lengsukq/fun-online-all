<template>
<h3>axios 请求数据展示demo</h3>
  <ul v-for="item in data">
    <li>id:{{ item.id }}</li>
    <li>姓名:{{ item.name }}</li>
    <li>手机号:{{ item.phone }}</li>
    <li>座右铭:{{ item.keywords }}</li>
  </ul>
  <hr>
    <div style="margin: 20px" />
    <el-form
        label-position="right"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
    >
      <el-form-item label="id：">
        <el-input v-model="formLabelAlign.id" />
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="formLabelAlign.name" />
      </el-form-item>
      <el-form-item label="电话：">
        <el-input v-model="formLabelAlign.phone" />
      </el-form-item>
      <el-form-item label="座右铭：">
        <el-input v-model="formLabelAlign.keywords" />
      </el-form-item>
      <el-form-item>
        <el-button @click="changeInfoAct" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </template>

<script setup lang="ts">
import apiHttp from "../api/api"
import {onMounted, reactive, ref} from "vue";

//第一种
const data = ref(null)
//第二种
//let books = reactive({
// list: []
// })
// books.list = response.data
const getInfo = ()=>{
  apiHttp.getUniteLoginUrl().then((res: any)=>{
    data.value = res.data;
    console.log('getInfo',res);
  })
}
const formLabelAlign = reactive({
  name: '',
  id: '',
  phone: '',
  keywords: '',
})

const changeInfoAct = ()=>{
  apiHttp.changeInfo(formLabelAlign).then((res: any)=>{
    getInfo();
    console.log('changeInfoAct',res);
  })
}

onMounted(()=>{
  getInfo();
})
</script>

<style scoped>

</style>
