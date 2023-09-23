<template>
  <el-scrollbar height="400px" v-show="connectionStatus==='inside'" ref="chatContent">
    <div ref="inChatContent">
      <p v-for="(item, index) in arr" :key="index">{{ item }}</p>

    </div>

  </el-scrollbar>
  <h1 v-if="connectionStatus!=='inside'">Chat Rom</h1>
  <h3>状态：{{ statusText[connectionStatus] }}</h3>
  <el-form>
    <el-form-item label="昵称：">
      <el-input v-model="name" placeholder="请输入你的昵称" :disabled="connectionStatus==='inside'"/>
    </el-form-item>
    <el-form-item label="房号：">
      <el-input v-model="roomId" placeholder="请输入房间号" :disabled="connectionStatus==='inside'"/>
    </el-form-item>
    <el-form-item label="内容：" v-if="connectionStatus==='inside'">
      <el-input v-model="msg" placeholder="请输入聊天内容" @keydown.enter="clickSend"/>
    </el-form-item>

    <el-form-item label="">
      <el-button type="primary" @click="clickJoin" v-if="connectionStatus==='success'">加入房间</el-button>
      <el-button type="danger" @click="clickLeave" v-if="connectionStatus==='inside'">离开房间</el-button>
      <el-button type="primary" @click="clickSend" v-if="connectionStatus==='inside'">发送消息</el-button>
      <el-button type="danger" @click="clearMessage()" v-if="connectionStatus==='inside'">清空消息</el-button>

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="reOpen" v-if="connectionStatus==='fail'">重新连接</el-button>
    </el-form-item>

  </el-form>


</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import socketAct from '../hook/socketAct.ts'
// 添加 beforeunload 事件监听器
window.addEventListener("beforeunload", () => {
  if (roomId && connectionStatus.value === 'inside') {
    clickLeave();
  }
  return true;
});
onUnmounted(()=>{
  window.removeEventListener('beforeunload', () => {})
})
console.log('socketInit',socketAct)
const socket = socketAct.socketInit();

const connectionStatus = ref<string>('fail');
const statusText = reactive({
  'fail': '未连接',
  'inside': '聊天中',
  'success': '已连接'
})
const title = ref("正在连接服务器");

const reOpen = () => {
  socket.open()
}

const storeHistory = localStorage.getItem('storeHistory') ? JSON.parse(localStorage.getItem('storeHistory')) : {};
const setHistory = (roomId) => {
  storeHistory[roomId] = arr.value;
  localStorage.setItem('storeHistory', JSON.stringify(storeHistory))
}
const getHistory = (roomId) => {
  arr.value = storeHistory[roomId] ? storeHistory[roomId] : arr.value;
  if (arr.value.length !== 0) {
    setTimeout(() => {
      scrollToBottom();
    }, 200)
  }
}
const clearMessage = () => {
  arr.value = []
}

const arr = ref<any>([]);
const roomId = ref("");
const msg = ref("");
const name = ref("");
// 点击加入房间
const clickJoin = () => {
  if (!name.value || !roomId.value) {
    ElMessage.warning("请输入完整的房间号和用户名");
    return;
  }
  arr.value.length = 0;
  getHistory(roomId.value)
  socket.emit("join", {roomId: roomId.value, name: name.value});
};

// 点击离开房间
const clickLeave = () => {
  socket.emit("leave", {roomId: roomId.value, name: name.value});
  roomId.value = "";
};


const chatContent = ref(null) // 创建一个引用
const inChatContent = ref(null) // 创建一个引用
const scrollToBottom = () => {
  console.log('chatContent', chatContent.value.clientHeight, 'inChatContent', inChatContent.value.clientHeight)
  chatContent.value.setScrollTop(inChatContent.value.clientHeight)
}

// 发送消息
const clickSend = () => {
  socket.emit("sendMsgByRoom", {roomId: roomId.value, name: name.value, msg: msg.value});
  msg.value = "";
}


onMounted(() => {

  scrollToBottom();
  // 连接成功
  socket.on("connect", () => {
    title.value = "连接服务器成功";
    connectionStatus.value = "success";
    ElMessage.success("连接服务器成功");
  });

  // 房间好友上线通知
  socket.on("say", (data) => {
    console.log('房间好友上线通知', data)
    if (data.status === 'join') {
      connectionStatus.value = 'inside'
    } else if (data.status === 'leave') {
      if (name.value === data.name) {
        setHistory(data.roomId);
        arr.value = [];
      }
      connectionStatus.value = name.value === data.name ? 'success' : connectionStatus.value;
    }
    ElMessage.info(`${data.name}${data.status === 'join' ? '加入' : '离开'}了[${data.roomId}房间]`);
  });

  // 收到的消息
  socket.on("receiveMsg", (id, name, msg) => {
    console.log(id, name, msg)
    arr.value.push(`${name}：${msg}`);
    setTimeout(() => {
      scrollToBottom();
    }, 100)
  });
  // 连接失败
  socket.on('connect_error', function () {
    socket.close();
    connectionStatus.value = 'fail';
    ElMessage.error('连接服务器超时')
  });
});

</script>

<style scoped>

</style>
