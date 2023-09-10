<template>
  <div>
    我是about页面, {{ title }}
    <br>
    当前数字{{ num }}
  </div>
  <button @click="upData">点击增加</button>
</template>

<script setup lang="ts">
// 给一个props阔以在script方法块调用，否则无法调用
const props = defineProps({
  title: {
    type: String,
    default: '父传子未触发',
  },
  num: {
    type: Number,
    default: 0,
  }
})
// 必须有优先申明方法名
const emit = defineEmits(['upDate'])
//在Vue中子组件不能直接向父组件传值，子组件需要调用父组件传递过来的方法，然后再父组件中通过方法修改值。
//子组件无法直接修改props数据
const upData = () => {
  console.log('子组件upDate', props.num)
  // props.value.num ++ ;
  emit('upDate', '新值')
}
</script>

<style scoped></style>
