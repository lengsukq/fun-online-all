<template>
  <div id="aaa">
    <h1>父组件:{{ name }}</h1>
    <p>当前颜色: {{ color }}</p>
    <button @click="color='red'">红</button>
    <button @click="color='yellow'">黄</button>
    <button @click="color='blue'">蓝</button>
    <br>
    <button @click="name='小明'">小明</button>
    <button @click="name='小红'">小红</button>
    <button @click="name='小蓝'">小蓝</button>
    <hr>
    <Son/>
    <br>
    <h2>测试Teleport</h2>
    <button @click="openTeleport">点击打开Teleport</button>
    <modalButton @closeTeleport="closeTeleport" :isShow="isShow"/>
    测试
  </div>

</template>

<script lang="ts">
import {provide, ref} from 'vue'
/*
- provide` 和 `inject` 提供依赖注入，功能类似 2.x 的 `provide/inject
- 实现跨层级组件(祖孙)间通信
*/

import Son from './provide-inject-child.vue'
import modalButton from './teleport.vue'

export default {
  name: 'ProvideInject',
  components: {
    Son,
    modalButton
  },
  setup() {

    const color = ref('red')
    const name = ref('张三')
    provide('name', name)
    provide('color', color)
    const isShow = ref(false)
    const closeTeleport = (key) => {
      console.log('父组件触发closeTeleport')
      isShow.value = key
    }
    const openTeleport = () => {
      isShow.value = true
      console.log('父组件触发openTeleport', isShow.value)

    }
    return {
      color,
      name,
      isShow,
      closeTeleport,
      openTeleport
    }
  }
}
</script>
