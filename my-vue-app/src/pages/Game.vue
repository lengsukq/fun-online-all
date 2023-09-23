<template>
  <div class="gameContainer">
    <!--    基础信息-->
    <div>
      <el-button type="primary" @click="initGame">开始游戏</el-button>
      总分： {{ score }} <br>
      {{ nameList.toString() }}当前在[{{ roomId }}]号房间
      <h5 v-for="(item,index) in arr" :key="index">
        {{ item }}
      </h5>
    </div>
    <div class="game" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
         @mousedown="onTouchStart" @mousemove="onTouchMove" @mouseup="onTouchEnd">
      <!-- 背景布局 -->
      <div class="game-bg">
        <div class="item" v-for="i in 16" :key="i"></div>
      </div>

      <div class="canvas">
        <NumberBlock v-for="(v,i) in numberList" :key="v.uid" :item="v" @remove="removeNumber(i)"/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import NumberBlock from '../components/NumberBlock.vue'
import socketAct from '../hook/socketAct.ts'
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
// 添加 beforeunload 事件监听器
window.addEventListener("beforeunload", () => {
  if (roomId && connectionStatus.value === 'inside') {
    clickLeave();
  }
  return true;
});
const socket = socketAct.socketInit();
const roomId = ref(''), name = ref(''), nameList = reactive([]);
const connectionStatus = ref<string>('fail');
const arr = reactive([]);
const router = useRouter();
let query = router.currentRoute.value.query;
roomId.value = <string>query.roomId;
name.value = <string>query.name;
// 点击加入房间
const clickJoin = () => {
  socket.emit("join", {roomId: roomId.value, name: name.value});
};
// 点击离开房间
const clickLeave = () => {
  socket.emit("leave", {roomId: roomId.value, name: name.value});
  roomId.value = "";
};
// 发送消息
const clickSend = () => {
  socket.emit("sendMsgByRoom", {roomId: roomId.value, name: name.value, msg: direction.value});
  direction.value = "";
}
const sendGameInfo = (data:object) => {
  let gameInfo={
    name:name.value,
    roomId:roomId.value,
    gameInfo:data,
  };
  console.log('sendGameInfo',gameInfo)
  socket.emit("sendGameInfo", {
    name:name.value,
    roomId:roomId.value,
    gameInfo:data,
  });
}

onMounted(() => {
  socket.on("connect", () => {
    connectionStatus.value = "success";

    ElMessage.success("连接服务器成功");
  });
  clickJoin();
  // 房间好友上线通知
  socket.on("say", (data) => {
    console.log('房间好友上线通知', data)
    if (data.status === 'join') {
      connectionStatus.value = 'inside';
      nameList.push(data.name);
    } else if (data.status === 'leave') {
      nameList.splice(nameList.indexOf(data.name), 1);
      if (name.value === data.name) {
      }
      connectionStatus.value = name.value === data.name ? 'success' : connectionStatus.value;
    }
    ElMessage.info(`${data.name}${data.status === 'join' ? '加入' : '离开'}了[${data.roomId}房间]`);
  });
  // 收到的消息
  socket.on("receiveMsg", (id, name, msg) => {
    console.log(id, name, msg)
    arr.push(`${name}：${msg}`);
    // onTouchEnd();
  });
  // 收到的游戏数据
  socket.on("receiveGameInfo", (recGameInfo) => {
    console.log('收到的游戏数据',recGameInfo)
    if (recGameInfo.isInit){
      initGame(false,recGameInfo)
    }
  });
})
const startY = ref(0);
const startX = ref(0);
const onTouchStart = (event) => {

  if (event.clientX) {
    console.log('鼠标事件');
    startY.value = event.pageY;
    startX.value = event.pageX;
  } else {
    console.log('触摸事件');
    // 获取手指的初始坐标
    startY.value = event.touches[0].pageY;
    startX.value = event.touches[0].pageX;
  }

}

const direction = ref('')
const onTouchMove = (event) => {

  event.preventDefault()
  let moveEndX = 0, moveEndY = 0;
  if (event.clientX) {
    moveEndX = event.pageX
    moveEndY = event.pageY
  } else {
    moveEndX = event.changedTouches[0].pageX
    moveEndY = event.changedTouches[0].pageY
  }

  let X = moveEndX - startX.value
  let Y = moveEndY - startY.value
  if (Math.abs(X) > Math.abs(Y) && X > 100) {
    direction.value = 'right';
  } else if (Math.abs(X) > Math.abs(Y) && X < 100) {
    direction.value = 'left';
  } else if (Math.abs(Y) > Math.abs(X) && Y > 100) {
    direction.value = 'down';
  } else if (Math.abs(Y) > Math.abs(X) && Y < 100) {
    direction.value = 'up';
  } else {
    direction.value = '';

    // alert('just touch')
  }
}

const onTouchEnd = () => {
  switch (direction.value) {
    case 'right':
      right();
      update();
      break;
    case 'left':
      left();
      update();
      break;
    case 'down':
      down();
      update();
      break;
    case 'up':
      up();
      update();
      break;
    case '':
      break;
  }
  clickSend();
}

let uid = 0;

const grid = [[], [], [], []];
const numberList = ref([]).value;

// 计分
const score = ref(0);

function addScore(num) {
  score.value += num;
}

const gameInfo = reactive({});
// 初始化游戏
function initGame(isNewGame=true,recGameInfo={count1:0,count2:0}) {
  uid = 0;
  score.value = 0;
  grid.forEach((v, i) => {
    console.log(v)
    grid[i] = []
  });
  numberList.length = 0;
  if(isNewGame){
    random(true,1);
    random(true,2);
    gameInfo['isInit'] = true;
    sendGameInfo(gameInfo)
  }else{
    random(false,1,recGameInfo.count1);
    random(false,2,recGameInfo.count2);
  }


}

// 随机选中一个空位置
function random(isNewGame=false,count=0,recNum=0) {
  let num = 0;
  if (isNewGame){
     num = Math.floor(Math.random() * 16);
    gameInfo[`count${count}`] = num;
  }else{
    num =recNum
  }

  while (num > -1) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!grid[i][j]) {
          if (num === 0) {
            return createNumber(i, j)
          } else {
            num--;
          }
        }
      }
    }
  }
}

// 创建number
function createNumber(x, y) {
  let number = ref({
    x,
    y,
    number: 1,
    uid: ++uid
  }).value;
  grid[x][y] = number;
  numberList.push(number);
}

// 移除number
function removeNumber(i) {
  numberList.splice(i, 1);
}


/*
 * 对与用户操作，如果用户操作“上”，那么需要从上往下遍历，操作“左”就从左往右遍历
 */
function up() {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      move(i, j, 'up');
    }
  }
}

function down() {
  for (let i = 2; i >= 0; i--) {
    for (let j = 0; j < 4; j++) {
      move(i, j, 'down');
    }
  }
}

function left() {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      move(i, j, 'left');
    }
  }
}

function right() {
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      move(i, j, 'right');
    }
  }
}

function move(x, y, dir) {
  let self = grid[x][y];
  if (!self) return;

  grid[x][y] = undefined;
  if (dir === 'up') {
    while (x-- > 0) {
      if (moveTo(self, x, y) === false) {
        break;
      }
    }
  } else if (dir === 'down') {
    while (x++ < 3) {
      if (moveTo(self, x, y) === false) {
        break;
      }
    }
  } else if (dir === 'left') {
    while (y-- > 0) {
      if (moveTo(self, x, y) === false) {
        break;
      }
    }
  } else if (dir === 'right') {
    while (y++ < 3) {
      if (moveTo(self, x, y) === false) {
        break;
      }
    }
  }
  if (!self._delete) {
    grid[self.x][self.y] = self;
  }
}

let _moved = false; // 是否移动过
function moveTo(self, x, y) { // 判断下一格是否能移动，以及是否合并
  if (grid[x][y]) {
    if (grid[x][y].number === self.number) {
      self.x = x;
      self.y = y;
      self._delete = true;
      grid[x][y].number *= 2;
      addScore(grid[x][y].number)
      _moved = true;
    }
    return false;
  } else {
    self.x = x;
    self.y = y;
    _moved = true;
    return true;
  }
}

function update() {
  if (_moved) {
    _moved = false;
    random();
  } else {
    isEnded();
  }
}

function isEnded() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!grid[i][j]) {
        return;
      }
    }
  }
  alert('您的得分是：' + score.value + '分');
}

function listener(e) {
  console.log('listener', e.keyCode)
  switch (e.keyCode) {
    case 38:
    case 87:
      up();
      break;
    case 40:
    case 83:
      down();
      break;
    case 37:
    case 65:
      left();
      break;
    case 39:
    case 68:
      right();
      break;
    default:
      return true;
  }

  e.preventDefault();
  update();
  return false;
}

onMounted(() => {
  // initGame();
  window.addEventListener('keydown', listener);
});

onUnmounted(() => {
  window.removeEventListener('keydown', listener)
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gameContainer {
  display: flex;
}

.title {
  text-align: center;
  color: #776e65;
  font-size: 50px;
  font-weight: bold;
}

.game {
  position: relative;
}

.game-bg {
  display: grid;
  grid-template-columns: repeat(4, 70px);
  grid-template-rows: repeat(4, 70px);
  grid-gap: 10px;
  border: 10px solid #bcaca0;
  background: #bcaca0;
  border-radius: 10px;
}

.item {
  width: 70px;
  height: 70px;
  background: #ccc1b4;
  border-radius: 5px;
}

.canvas {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
