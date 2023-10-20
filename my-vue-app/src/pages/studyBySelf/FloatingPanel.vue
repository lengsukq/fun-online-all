<template>
  <van-floating-panel v-model:height="height" :anchors="anchors">
    <div style="text-align: center; padding: 15px">
      <!--      <p>面板显示高度 {{ height.toFixed(0) }} px</p>-->
      <my-chat-room/>
    </div>
  </van-floating-panel>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import myChatRoom from '../chat.vue'

const anchors = [
  //Math.round() 函数返回一个数字四舍五入后最接近的整数。
  Math.round(0.1 * window.innerHeight),
  Math.round(0.35 * window.innerHeight),
  Math.round(0.6 * window.innerHeight),
  Math.round(0.85 * window.innerHeight),
];

const height = ref(anchors[0]);

</script>


<style scoped>
.van-floating-panel {
  border-top: 1px solid #dcdde2;
  background: rgba(255, 255, 255, 0.5);
}
</style>
