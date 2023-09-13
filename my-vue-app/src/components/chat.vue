<template>
  <h1>This is an about page</h1>
  <el-input v-model="name" placeholder="请输入你的昵称" />
  <el-input v-model="roomId" placeholder="请输入房间号" />
  <el-button type="primary" @click="clickJoin">点击加入房间</el-button>
  <el-button type="danger" @click="clickLeave">点击离开房间</el-button>
  <el-input v-model="msg" placeholder="请输入聊天内容" />
  <el-button type="primary" @click="clickSend">发送</el-button>
  <div v-for="(item, index) in arr" :key="index">{{ item }}</div>

</template>

<script setup lang="ts">
import io from 'socket.io-client';
import {onMounted,ref,reactive} from "vue";
import {ElMessage} from "element-plus";

const socket = io("http://127.0.0.1:3000", {
  timeout: 5000,
});
onMounted(() => {
  // 连接成功
  socket.on("connect", () => {
    ElMessage.success("连接成功");
  });

  // 房间好友上线通知
  socket.on("say", (message) => {
    ElMessage.info(message);
  });

  // 收到的消息
  socket.on("receiveMsg", (id,name, msg) => {
    console.log(id,name,msg)
    arr.value.push(`${name}：${msg}`);
  });
});
const arr = ref<any>([]);
const roomId = ref("");
const msg = ref("");
const name = ref("");
// 点击加入房间
const clickJoin = () => {
  arr.value.length = 0;
  socket.emit("join", { roomId: roomId.value,name: name.value });
};

// 点击离开房间
const clickLeave = () => {
  socket.emit("leave", { roomId: roomId.value });
  roomId.value = "";
};

// 发送消息
const clickSend = () => {
  socket.emit("sendMsgByRoom", { roomId: roomId.value, name:name.value,msg: msg.value });
  msg.value = "";
}
</script>

<style scoped>

</style>
