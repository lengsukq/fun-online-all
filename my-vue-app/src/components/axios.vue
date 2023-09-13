<template>
  <h3>axios 请求数据展示demo</h3>
  <ul v-for="item in data">
    <li>id:{{ item.id }}</li>
    <li>姓名:{{ item.name }}</li>
    <li>手机号:{{ item.phone }}</li>
    <li>座右铭:{{ item.keywords }}</li>
  </ul>
  <hr>
  <div style="margin: 20px"/>
  <el-form
      :model="formLabelAlign"
      label-position="right"
      label-width="100px"
      style="max-width: 460px"
  >
    <el-form-item label="id：">
      <el-input v-model="formLabelAlign.id"/>
    </el-form-item>
    <el-form-item label="姓名：">
      <el-input v-model="formLabelAlign.name"/>
    </el-form-item>
    <el-form-item label="电话：">
      <el-input v-model="formLabelAlign.phone"/>
    </el-form-item>
    <el-form-item label="座右铭：">
      <el-input v-model="formLabelAlign.keywords"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="changeInfoAct">修改</el-button>
      <el-button type="primary" @click="addUserAct">新增</el-button>
      <el-button type="primary" @click="deleteUserAct">删除</el-button>

    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import apiHttp from "../api/api"
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

//第一种
const data:any = ref('')
//第二种
//let books = reactive({
// list: []
// })
// books.list = response.data
const getInfo = () => {
  apiHttp.getUniteLoginUrl().then((res: any) => {
    data.value = res.data;
    console.log('getInfo', res);
  })
}
const formLabelAlign = reactive({
  name: '',
  id: '',
  phone: '',
  keywords: '',
})

const changeInfoAct = () => {
  apiHttp.changeInfo(formLabelAlign).then((res: any) => {
    console.log('changeInfoAct', res);

    if (res.code === 200) {
      ElMessage.success(res.data)
      getInfo();
    } else {
      ElMessage.error(res.data)
    }
  })
}

const addUserAct = () => {
  apiHttp.addUser(formLabelAlign).then((res: any) => {
    console.log('addUserAct', res);

    if (res.code === 200) {
      ElMessage.success(res.data)
      getInfo();
    } else {
      ElMessage.error(res.data)
    }
  })
}

const deleteUserAct = () => {
  apiHttp.deleteUser({id: formLabelAlign.id}).then((res: any) => {
    console.log('deleteUserAct', res);

    if (res.code === 200) {
      ElMessage.success(res.data)
      getInfo();
    } else {
      ElMessage.error(res.data)
    }
  })
}

onMounted(() => {
  getInfo();
})
</script>

<style scoped>

</style>
