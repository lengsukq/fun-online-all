<template>

  <h1>Chat Rom</h1>
  <h3>状态：{{statusText[connectionStatus]}}</h3>
  <el-form>
    <el-form-item label="昵称：">
      <el-input v-model="name" placeholder="请输入你的昵称" :disabled="connectionStatus==='inside'" />
    </el-form-item>
    <el-form-item label="房号：">
      <el-input v-model="roomId" placeholder="请输入房间号" :disabled="connectionStatus==='inside'"/>
    </el-form-item>
    <el-form-item label="内容：" v-if="connectionStatus==='inside'">
      <el-input v-model="msg" placeholder="请输入聊天内容" />
    </el-form-item>

    <el-form-item label="">
      <el-button type="primary" @click="clickJoin" v-if="connectionStatus==='success'">加入房间</el-button>
      <el-button type="danger" @click="clickLeave" v-if="connectionStatus==='inside'">离开房间</el-button>
      <el-button type="primary" @click="clickSend" v-if="connectionStatus==='inside'">发送消息</el-button>
      <el-button type="danger" @click="clearMessage(roomId)" v-if="connectionStatus==='inside'">清空消息</el-button>

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="reOpen" v-if="connectionStatus==='fail'">重新连接</el-button>
    </el-form-item>

  </el-form>


  <div v-for="(item, index) in arr" :key="index">{{ item }}</div>

</template>

<script setup lang="ts">
import io from 'socket.io-client';
import {onMounted, ref, reactive, computed} from "vue";
import {ElMessage} from "element-plus";
const socket = io("http://127.0.0.1:3000", {
  timeout: 5000,
});
const connectionStatus = ref('fail');
const statusText = reactive({
  'fail': '未连接',
  'inside': '聊天中',
  'success': '已连接'
})
const title = ref("正在连接服务器");

const reOpen = ()=>{
  socket.open()
}

const storeHistory = localStorage.getItem('storeHistory')?JSON.parse(localStorage.getItem('storeHistory')):{};
const setHistory = (roomId)=>{
      storeHistory[roomId] = arr.value;
      localStorage.setItem('storeHistory',JSON.stringify(storeHistory))
}
const getHistory = (roomId)=>{
  arr.value = storeHistory[roomId]?storeHistory[roomId]:arr.value;
}
const clearMessage = (roomId)=>{
  arr.value = []
}

const arr = ref<any>([]);
const roomId = ref("");
const msg = ref("");
const name = ref("");
// 点击加入房间
const clickJoin = () => {
  if (!name.value || !roomId.value){
    ElMessage.warning("请输入完整的房间号和用户名");
    return;
  }
  arr.value.length = 0;
  getHistory(roomId.value)
  socket.emit("join", { roomId: roomId.value,name: name.value });
};

// 点击离开房间
const clickLeave = () => {
  socket.emit("leave", { roomId: roomId.value,name: name.value });
  roomId.value = "";
};

// 发送消息
const clickSend = () => {
  socket.emit("sendMsgByRoom", { roomId: roomId.value, name:name.value,msg: msg.value });
  msg.value = "";
}
onMounted(() => {
  // 连接成功
  socket.on("connect", () => {
    title.value = "连接服务器成功";
    connectionStatus.value = "success";
    ElMessage.success("连接服务器成功");
  });

  // 房间好友上线通知
  socket.on("say", (data) => {
    console.log('房间好友上线通知',data)
    if (data.status === 'join'){
      connectionStatus.value = 'inside'
    }else if(data.status==='leave'){
      if (name.value === data.name){
        setHistory(data.roomId);
        arr.value = [];
      }
      connectionStatus.value = name.value===data.name?'success':connectionStatus.value;
    }
    ElMessage.info(`${data.name}${data.status==='join'?'加入':'离开'}了[${data.roomId}房间]`);
  });

  // 收到的消息
  socket.on("receiveMsg", (id,name, msg) => {
    console.log(id,name,msg)
    arr.value.push(`${name}：${msg}`);
  });
  // 连接失败
  socket.on('connect_error', function(error) {
    socket.close();
    connectionStatus.value = 'fail';
    ElMessage.error('连接服务器超时')
  });
});

</script>

<style scoped>

</style>
