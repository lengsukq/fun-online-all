<template>
  <div class="gameContainer">
    <!--    基础信息-->
    <div>
      <el-button type="primary" @click="initGame">开始游戏</el-button>
      总分： {{ score }} <br>
      <h5 v-for="(socre,name) in userScore">
        {{ `${name}:${socre}分` }}
      </h5>
      <!--      {{ nameList.toString() }}当前在[{{ roomId }}]号房间-->
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

      <div class="canvas" :key="setNumBlock">
        <NumberBlock v-for="(v,i) in numberList" :key="v.uid" :item="v" @remove="removeNumber(i)"/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onUnmounted, reactive, ref} from 'vue'
import NumberBlock from '../studyBySelf/NumberBlock.vue'
import socketAct from '../../hook/socketAct.ts'
import {ElMessage} from "element-plus";
import {userInfoStore} from '@/store/userInfo.ts'
// 从主组件接收游戏数据
import {gameDateStore} from "@/store/gameData.ts";

const setNumBlock = ref(1)
const socket = socketAct.socketInit();
const roomId = ref(''), name = ref('');
const arr = reactive([]);

const userInfo = userInfoStore();
roomId.value = <string>userInfo.roomId;
name.value = <string>userInfo.name;

const sendGameInfo = (data: object) => {
  let gameInfo = {
    name: name.value,
    roomId: roomId.value,
    gameInfo: data,
  };
  console.log('sendGameInfo', gameInfo)
  socket.emit("sendGameInfo", {
    name: name.value,
    roomId: roomId.value,
    gameInfo: data,
  });
}
let isReceive = false;

const actName = ref('测试');

const startY = ref(0);
const startX = ref(0);
const onTouchStart = (event) => {
  isReceive = false;
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
  if (Math.abs(X) > Math.abs(Y) && X > 0) {
    direction.value = 'right';
  } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
    direction.value = 'left';
  } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
    direction.value = 'down';
  } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
    direction.value = 'up';
  } else {
    direction.value = '';
  }
}

const moveNum = ref(0)

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
}

let uid = 0;

const grid = [[], [], [], []];
const numberList = ref([]).value;

// 计分
const score = ref(0);

interface MyObject {
  [key: string]: number;
}

const userScore = ref<MyObject>({})

function addScore(num: number) {
  userScore.value[actName.value] = userScore.value[actName.value] ? userScore.value[actName.value] + num : num
  // console.log('userScore.value', userScore.value)
  score.value += num;
}


const gameInfo = reactive({});

// 初始化游戏
function initGame(isNewGame = true, recGameInfo = {count1: 0, count2: 0}) {
  recGameInfoStore.changeVal('gameStatus','gaming');
  setNumBlock.value += setNumBlock.value;
  userScore.value = {};
  uid = 0;
  score.value = 0;
  grid.forEach((v, i) => {
    console.log('grid[i]', v)
    grid[i] = []
  });
  numberList.length = 0;
  console.log('numberList', numberList)
  if (isNewGame) {
    let num = 0;
    for (let i = 1; i < 3; i++) {
      num = Math.floor(Math.random() * 16);
      random(num);
      gameInfo[`count${i}`] = num;
    }
    gameInfo['isInit'] = true;
    sendGameInfo(gameInfo)
  } else {
    random(recGameInfo.count1);
    random(recGameInfo.count2);
  }

}

// 随机选中一个空位置
function random(num = 0) {
  console.log('random', num)
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
 * 对于用户操作，如果用户操作“上”，那么需要从上往下遍历，操作“左”就从左往右遍历
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
    // console.log('进行判断是否是接收端', isReceive)
    if (!isReceive) {
      let num = Math.floor(Math.random() * 16);
      random(num);
      sendGameInfo({moveNum: num, direction: direction.value})
    } else {
      random(moveNum.value);
    }
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
  recGameInfoStore.gameStatus.changeVal('gameStatus','over');
  ElMessage.info('您的得分是：' + score.value + '分')
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

const recGameInfoStore = gameDateStore();
console.log('从主组件接收游戏数据recGameInfoStore', recGameInfoStore.recGameInfo)
recGameInfoStore.$subscribe((mutation, state) => {
  console.log('recGameInfoStore.$subscribe', state.recGameInfo, mutation)
  let recGameInfo: any = state.recGameInfo;
  actName.value = recGameInfo.name;

  if (recGameInfo.name !== name.value.toString()) {
    if (recGameInfo.isInit) {
      isReceive = true;
      initGame(false, recGameInfo)
    } else {
      isReceive = true;
      direction.value = recGameInfo.direction;
      moveNum.value = recGameInfo.moveNum;
      onTouchEnd();
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', listener)
  window.removeEventListener('beforeunload', () => {
  })
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gameContainer {
  display: flex;
  flex-direction: column;
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
