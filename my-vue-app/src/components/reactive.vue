<script lang="ts" setup>
import {reactive, ref} from "vue";

const person = reactive({
  name: '张三',
  age: 20,
  car: [
    '奔驰', '宝马', '保时捷'
  ]
})
const car = ref(1)
const upData = () => {
  person.name += '+';
  person.age += 1;
  person.car.push(`新汽车${car.value}号`);
  car.value++;
}
</script>

<template>
  <h3>姓名：{{ person.name }}</h3>
  <h3>年龄：{{ person.age }}</h3>
  <h3>汽车：{{ person.car }}</h3>
  <h3>
    <button @click="upData()">更新数据</button>
  </h3>
</template>

