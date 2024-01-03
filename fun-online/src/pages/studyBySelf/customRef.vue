<template>
  <h2>App</h2>
  <input v-model="keyword" placeholder="搜索关键字"/>
  <p>keyword:{{ keyword }}</p>
</template>

<script lang="ts">
/*
customRef:
  创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制

需求:
  使用 customRef 实现 防抖函数 debounce 的示例
*/
/*customRef() 预期接收一个工厂函数作为参数，这个工厂函数接受 track 和 trigger 两个函数作为参数，并返回一个带有 get 和 set 方法的对象。

 一般来说，track() 应该在 get() 方法中调用，而 trigger() 应该在 set() 中调用。然而事实上，你对何时调用、是否应该调用他们有完全的控制权。*/
import {customRef} from 'vue'

export default {

  setup() {
    const keyword = useDebouncedRef('', 500)
    console.log(keyword)
    return {
      keyword
    }
  },
}

/*
实现函数防抖的自定义ref
*/
function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: number
  return customRef((track, trigger) => {
    console.log('customRef', track, trigger)
    return {
      get() {
        // 告诉Vue追踪数据
        track()
        return value
      },
      set(newValue: T) {
        console.log('set', newValue)
        //WindowOrWorkerGlobalScope 内置的 clearTimeout() 方法取消了先前通过调用setTimeout()建立的定时器。
        clearTimeout(timeout)
        //timeout为调用 setTimeout() 函数时所获得的返回值，使用该返回标识符作为参数。
        timeout = setTimeout(() => {
          value = newValue
          // 告诉Vue去触发界面更新
          trigger()
        }, delay)
      }
    }
  })
}

</script>
