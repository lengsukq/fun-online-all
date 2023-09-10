import {onMounted, onUnmounted, ref} from "vue";


export default function useMousePosition(){

    const x=ref(0),y = ref(0)

    // 用于收集点击事件坐标的函数
    const updatePosition = (e: MouseEvent) => {
        x.value = e.pageX
        y.value = e.pageY
    }
    // 注册一个回调函数，在组件挂载完成后执行。
    onMounted(()=>{
        window.addEventListener('click',updatePosition)
    })
    // 注册一个回调函数，在组件实例被卸载之后调用。
    onUnmounted(()=>{
        window.removeEventListener('click',updatePosition)
    })

    return {x,y}
}
