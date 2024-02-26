# fun-online 
主要用的是vue3+ts，目前导航站为首页，可以从导航页跳转到在线聊天页面

## 实现功能 
- 在线即时聊天，不留存记录在服务器
- 共同游戏，目前就写了一个2048，考虑加一个井字棋
- 自写的导航站，连接fun-online-api的接口，动态获取数据
 

# 根目录添加.env.local文件
```text
VITE_API=https://XXXXX （你的服务器后台地址）
```
# 项目运行

```
yarn
yarn vite
```



