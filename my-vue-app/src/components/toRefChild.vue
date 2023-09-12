<template>
  <h2>Child</h2>
  <h3>foo:{{ foo }}</h3>
  <h3>length:{{ length }}</h3>
</template>

<script lang="ts">
import {computed, defineComponent, Ref, toRef} from 'vue'

const component = defineComponent({
  props: {
    foo: {
      type: Number,
      require: true
    }
  },

  setup(props, context) {
    console.log('props', props)
    // 双向 ref，会与源属性同步
    // 更改该 ref 会更新源属性
    const length = useFeatureX(toRef(props, 'foo'))
    console.log('length', length)
    return {
      length
    }
  }
})

function useFeatureX(foo: Ref) {
  // Set operation on key "foo" failed: target is readonly 属性只读，无法操作
  // foo.value = 100;
  console.log('useFeatureX', foo.value)
  let fooLength = computed(() => foo.value.toString().length)

  return fooLength
}

export default component
</script>
