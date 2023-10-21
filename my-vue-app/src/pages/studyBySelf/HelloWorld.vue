<script lang="ts" setup>
import {userInfoStore} from '@/store/userInfo.ts'
const userInfo = userInfoStore();
//使用$patch改变数据 $patch 可以同时修改多个值
// 但是也需要传入整个包括所有元素的数组，这无疑增加了书写成本和风险，显然是不合理的，所以一般都推荐使用第二种传入一个函数的写法
// userInfo.$patch({ name: userInfo.name })

//使用actions中的方法修改数据 （推荐）
// const setName = (keyWords,val) =>{
//   userInfo.changeVal(keyWords,val+userInfo[keyWords])
// }
</script>

<template>
  <h5>hello,word!</h5>
  <h3>{{ userInfo.name }}</h3>
</template>

<style scoped>
</style>
