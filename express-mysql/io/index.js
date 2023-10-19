// 将server作为参数传入
const {Server} = require("socket.io");
module.exports = function (server) {
    let roomInfo = {};

    //  cors: true 跨域允许，不然前端会报跨域错误
    let io = new Server(server, {cors: true});

    // socket.to（room）
    // room （串）
    // Socket链接返回
    // 为随后的事件发射设置一个修饰符，事件只会广播到已加入给定的客户端room（套接字本身被排除）。
    //
    // 要发射到多个房间，可以to多次打电话。

    // socket.in（room）
    // socket.to（房间）的同义词。
    io.on("connect", (socket) => {
        // 加入房间并通知
        socket.on("join", ({roomId, name}) => {
            console.log(`${name}进入[${roomId}房间]`);
            if (roomInfo[`${roomId}`]){
                roomInfo[`${roomId}`].push(name);
            }else{
                roomInfo[`${roomId}`]=[name];
            }
            socket.join(roomId);
            io.in(roomId).emit("say", {name: name, roomId: roomId, status: 'join'});
        });
        // 离开房间并通知
        socket.on("leave", ({roomId, name}) => {
            console.log(`${name}离开[${roomId}房间]`,roomInfo[roomId]);
            roomInfo[roomId] = roomInfo[roomId]?roomInfo[roomId].filter((item) => item !== name):roomInfo[roomId];
            io.in(roomId).emit("say", {name: name, roomId: roomId, status: 'leave'});
            socket.leave(roomId);
        });

        // 通过房间号发送消息
        socket.on("sendMsgByRoom", ({roomId, name, msg}) => {
            console.log(`${name}发送消息到[${roomId}房间]:`, msg);
            io.in(roomId).emit("receiveMsg", socket.id, name, msg);
        });

        // 游戏数据传输
        socket.on("sendGameInfo", ({name,roomId,gameInfo}) => {
            console.log(`${name}传输游戏数据到[${roomId}房间]:`, gameInfo);
            console.log('roomInfo',roomInfo)
            gameInfo['name'] = name;
            io.in(roomId).emit("receiveGameInfo", gameInfo);
        });

        // 获取当前在线人数
        socket.on("sendRoomId", ({roomId}) => {
            console.log('当前roomId',roomId)
            io.in(roomId).emit("getOnlineNumber", roomInfo[roomId]);
        });
    });

}
