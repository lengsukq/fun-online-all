// stores/counter.js
import { defineStore } from 'pinia'
import {useRouter} from "vue-router";
const router = useRouter();

export const userInfoStore = defineStore('counter', {
    state: () => {
        return { name: '' ,
            roomId:'',
            connectionStatus:'fail',
        }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        changeVal(keyWords,val){
            console.log('setName',keyWords,val)
            this[keyWords] = val;
        }
    },
})
