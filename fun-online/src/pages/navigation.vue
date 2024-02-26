<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import {useRouter} from 'vue-router'
import { showNotify } from 'vant';
import apiHttp from "@/api/api.ts";
const router = useRouter();
const checked = ref(false);
const webNavList = ref([])
const adminWebNavList = ref([])

const getImageUrl = (name) => new URL(`../assets/webIcon/${name}`, import.meta.url).href;
const toPage = (item) => {
  const newPath = {
    'fun-online': 'http://www.honghupetrel.fun:8090/#/studyBySelf',
    'drawio': 'http://www.honghupetrel.fun:8443',
    'halo': 'http://www.honghupetrel.fun:8888',
    '小雅alist': 'http://www.honghupetrel.fun:5678',
    '1panel': 'http://www.honghupetrel.fun:23780/QueenSu',
    'lucky': 'http://www.honghupetrel.fun:11423',
    '青龙面板':'http://www.honghupetrel.fun:5700',
    'filecodebox':'http://www.honghupetrel.fun:40157',
    'phpmyadmin':'http://www.honghupetrel.fun:8089',
    'qbittorrent':'http://www.honghupetrel.fun:6882',
    'SPlayer':'http://www.honghupetrel.fun:7899',
    'LengのCode':'https://github.com/lengsukq',
  }
  let path = checked.value && newPath.hasOwnProperty(item.name) ? newPath[item.name] : item.path;
  if (path.includes('http')) {
    window.open(path, '_blank');
  } else if (!path) {
    showNotify({ type: 'primary', message: '暂不支持IPV4访问' });
  } else {
    router.push({
      path: path
    })
  }
}
const adminPassWord = ref('');
const adminDialog = ref(false);
const isAdmin = ref(false);

const verifyFunAdmin = () => {
  apiHttp.verifyFunAdmin({adminPassWord:adminPassWord.value}).then((res: any) => {
    console.log('verifyFunAdmin', res);
    if (res.code===200){
      showNotify({ type: 'success', message: res.msg });
      adminDialog.value = false;
      isAdmin.value = true;
      adminWebNavList.value  = res.data

    }else{
      showNotify({ type: 'warning', message: res.msg });

    }
  })
}
const verifyNavListAct = () => {
  apiHttp.verifyNavList().then((res: any) => {
    console.log('verifyFunAdmin', res);
    if (res.code===200){
      webNavList.value  = res.data
    }else{
      showNotify({ type: 'warning', message: res.msg });

    }
  })
}
onBeforeMount(() => {
  verifyNavListAct();
});
</script>

<template>
  <van-overlay :show="adminDialog" @click="adminDialog = false">
    <div class="wrapper" >
        <van-cell-group inset  @click.stop>
          <van-field v-model="adminPassWord" type="password" placeholder="请输入" @keyup.enter="verifyFunAdmin"/>
        </van-cell-group>
    </div>
  </van-overlay>
  <van-grid :column-num="3">
    <van-grid-item>
      <div class="switchContainer">
        <van-switch v-model="checked"/>
      </div>
        <van-swipe-cell>
          <div class="itemName">ipv6访问</div>
          <template #right>
            <van-button round type="success" size="mini" @click="adminDialog = true">FUN</van-button>
          </template>
        </van-swipe-cell>


    </van-grid-item>
    <van-grid-item v-for="item in webNavList" :key="item.name" @click="toPage(item)">
      <van-image :src="item.iconURL?item.iconURL:getImageUrl(item.icon)"/>
      <div class="itemName">{{ item.name }}</div>
    </van-grid-item>

  </van-grid>
  <van-grid :column-num="3" v-if="isAdmin">
    <van-grid-item v-for="item in adminWebNavList" :key="item.name" @click="toPage(item)">
      <van-image :src="item.iconURL?item.iconURL:getImageUrl(item.icon)"/>
      <div class="itemName">{{ item.name }}</div>
    </van-grid-item>
  </van-grid>

</template>

<style scoped lang="less">
.van-grid-item{
  //flex-basis: 30%!important;
}
.itemName{
  font-size: clamp(12px, calc(1rem - 5px), 1rem);
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.switchContainer{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
}
.van-image{
  width: 5rem;
  height: 5rem;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  background-color: #fff;
}
</style>
