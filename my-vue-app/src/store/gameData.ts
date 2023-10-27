// stores/counter.js
import { defineStore } from 'pinia'

export const gameDateStore = defineStore('gameDate', {
    state: () => {
        return { recGameInfo:{name:1},gameStatus:'over'}
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
