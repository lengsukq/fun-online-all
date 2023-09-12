<template>
  <teleport to="body">
    <div v-if="isShow" class="modal">
      <div>
        I'm a teleported modal!
        (My parent is "body")
        <button @click="closeTeleportButton">
          Close
        </button>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>

import {defineEmits} from 'vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
})
console.log('isShow', props.isShow)
const emit = defineEmits(['closeTeleport'])
console.log('emit', emit)
const closeTeleportButton = () => {
  console.log('子组件closeTeleport')
  emit('closeTeleport', false)
}

</script>


<style>
.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 300px;
  /*height: 300px;*/
  padding: 5px;
}
</style>
