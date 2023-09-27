<template>
  <div class="drag-ball" ref="dragBall" @touchstart.stop.prevent="touchstart" @touchmove.stop.prevent="touchmove"
       @touchend.stop.prevent="touchend">
    <div class="drag-content">
      <slot name="value">{{ value }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
const props = defineProps({
  value: {
    type: String,
    default: '悬浮球！'
  }
})

const canDrag = ref(false);
const dragBall = ref(null);
// 初始位置
const positionOld = ref({
  left: 0,
  top: 0
});
// 位置
const position = ref({
  left: 0,
  top: 0
})
const inset = ref({
  left: 0,
  top: 0
})
// 移动
const move = ref({})
const touchstart = (e) => {
  if (!canDrag.value) {
    startTime.value = e.timeStamp;
    positionOld.value = getPosition(dragBall.value);
    position.value = positionOld.value;
    inset.value = {
      left: e.targetTouches[0].clientX - positionOld.value.left,
      top: e.targetTouches[0].clientY - positionOld.value.top
    };
    canDrag.value = true;
  }
}

const touchmove = (e) => {
  if (canDrag.value) {
    let left = e.targetTouches[0].clientX - inset.value.left;
    let top = e.targetTouches[0].clientY - inset.value.top;
    if (left < 0) {
      left = 0;
    } else if (left > (window.innerWidth - dragBall.value.offsetWidth)) {
      left = window.innerWidth - dragBall.value.offsetWidth;
    }
    if (top < 0) {
      top = 0;
    } else if (top > (window.innerHeight - dragBall.value.offsetHeight)) {
      top = window.innerHeight - dragBall.value.offsetHeight;
    }
    dragBall.value.style.left = left + 'px';
    dragBall.value.style.top = top + 'px';
    move.value = {
      x: left - positionOld.value.left,
      y: top - positionOld.value.top
    };
    position.value = {left, top};
  }
}
const endTime = ref('');
const startTime = ref('');
const emit = defineEmits(['click'])
const touchend = (e) => {
  if (canDrag.value) {
    endTime.value = e.timeStamp;
    if (endTime.value - startTime.value > 400 || Math.abs(move.value.x) > 2 || Math.abs(move.value.y) > 2) {
      // 非单击事件
      if ((position.value.left + dragBall.value.offsetWidth / 2) > window.innerWidth / 2) {
        dragBall.value.style.left = window.innerWidth - dragBall.value.offsetWidth + 'px';
      } else {
        dragBall.value.style.left = 0 + 'px';
      }
    } else {
      emit('click');
    }
    inset.value = {left: 0, top: 0};
    move.value = {};
    position.value = {left: 0, top: 0};
    canDrag.value = false;
  }
}

// 获取dom的绝对位置
const getPosition = (source) => {
  let left = source.offsetLeft; //获取元素相对于其父元素的left值var left
  let top = source.offsetTop;
  let current = source.offsetParent; // 取得元素的offsetParent // 一直循环直到根元素
  while (current != null) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return {
    left: left,
    top: top
  };
}

</script>
<style scoped>
.drag-ball {
  position: absolute;
  z-index: 10003;
  right: 0;
  top: 70%;
  width: 20px;
  height: 20px;
  background: deepskyblue;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 0px 10px 2px skyblue;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  user-select: none;
}

.drag-ball .drag-content {
  overflow-wrap: break-word;
  font-size: 14px;
  color: #fff;
  letter-spacing: 2px;
}
</style>
