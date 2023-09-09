<template>
  <canvas ref="canvas" width="800" height="600"></canvas>
</template>

<script>
export default {
  mounted() {
    const canvas = this.$refs.canvas
    const ctx = canvas.getContext('2d')
    // 在这里绘制游戏画布

    // 绘制地图
    ctx.fillStyle = '#f8f8f8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 10
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // 绘制防御塔
    ctx.fillStyle = '#333'
    ctx.fillRect(100, 100, 50, 50)

    // 绘制敌人
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 250, 50, 50)

    // 移动敌人
    let enemyX = 0
    setInterval(() => {
      enemyX += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillRect(enemyX, 250, 50, 50)
    }, 10)
    // 添加交互
    canvas.addEventListener('click', (event) => {
      const x = event.pageX - canvas.offsetLeft
      const y = event.pageY - canvas.offsetTop
      ctx.fillStyle = '#333'
      ctx.fillRect(x, y, 50, 50)
    })



  }
}
</script>

