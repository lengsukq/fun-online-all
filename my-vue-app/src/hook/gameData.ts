// stores/counter.js
import { defineStore } from 'pinia'

export const gameDateStore = defineStore('counter', {
    state: () => {
        return { recGameInfo:{}}
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
