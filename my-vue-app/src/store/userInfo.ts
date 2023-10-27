// stores/counter.js
import { defineStore } from 'pinia'
import {useRouter} from "vue-router";

export const userInfoStore = defineStore('counter', {
    state: () => {
        return { name: '' ,
            roomId:'',
            connectionStatus:'fail',
            // 当前房间在线列表
            allPath:[],

        }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        changeVal(keyWords:string,val:any){
            console.log('setName',keyWords,val)
            this[keyWords] = val;
        }
    },
})
