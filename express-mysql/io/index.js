// 将server作为参数传入
const {Server} = require("socket.io");
module.exports = function (server) {
    let roomInfo = {
        nameList: [],
        gameInfo: {},
        gameRoom: {}
    };

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
            if (roomInfo.nameList[`${roomId}`]) {
                roomInfo.nameList[`${roomId}`].push(name);
            } else {
                roomInfo.nameList[`${roomId}`] = [name];
            }
            socket.join(roomId);
            io.in(roomId).emit("say", {name: name, roomId: roomId, status: 'join'});
        });
        // 离开房间并通知
        socket.on("leave", ({roomId, name}) => {
            console.log(`${name}离开[${roomId}房间]`, roomInfo.nameList[roomId]);
            roomInfo.nameList[roomId] = roomInfo.nameList[roomId] ? roomInfo.nameList[roomId].filter((item) => item !== name) : roomInfo.nameList[roomId];
            io.in(roomId).emit("say", {name: name, roomId: roomId, status: 'leave'});
            socket.leave(roomId);
        });

        // 通过房间号发送消息
        socket.on("sendMsgByRoom", ({roomId, name, msg}) => {
            console.log(`${name}发送消息到[${roomId}房间]:`, msg);
            io.in(roomId).emit("receiveMsg", socket.id, name, msg);
        });

        // 获取当前在线人数
        socket.on("sendRoomId", ({roomId}) => {
            console.log('当前roomId', roomId)
            io.in(roomId).emit("getOnlineNumber", roomInfo.nameList[roomId]);
        });

        // 游戏数据传输
        socket.on("sendGameInfo", ({name, roomId, gameInfo}) => {
            console.log(`${name}传输游戏数据到[${roomId}房间]:`, gameInfo);
            console.log('roomInfo.nameList', roomInfo.nameList)
            gameInfo['name'] = name;
            io.in(roomId).emit("receiveGameInfo", gameInfo);
        });

        // 发送房间游戏状态
        socket.on("sendGameStatus", async ({roomId, gameName, actType}) => {
            console.log(`roomId:${roomId},gameName:${gameName},actType:${actType}`);
            if (actType !== 'getInfo') {
                roomInfo.gameInfo[gameName] = actType;
            } else {
                await upDataUserInfo(roomId,gameName);

            }

        });


        // 主动更新用户数据
        function upDataUserInfo(roomId,gameName) {
            // 向房间所有人发送广播，更新房间数据
            console.log('向房间所有人发送广播，更新房间数据')
            io.in(roomId).emit("receiveUpDateCommand",gameName);
        }

        // 接收用户数据
        socket.on("sendUserInfo", ({roomId, name, path, gameName,gameStatus}) => {
            console.log(`roomId:${roomId},name:${name},path:${path},gameStatus:${gameStatus}`);
            console.log('recUpDataUserInfoCount',roomInfo.nameList[roomId].length);
            roomInfo.gameRoom[roomId.toString()] = roomInfo.gameRoom[roomId.toString()]?roomInfo.gameRoom[roomId.toString()]:{};
            roomInfo.gameRoom[roomId.toString()][path.toString()] = roomInfo.gameRoom[roomId.toString()][path.toString()]?roomInfo.gameRoom[roomId.toString()][path.toString()].push(gameStatus):[gameStatus];

            if (roomInfo.gameRoom[roomId.toString()][path.toString()].length===roomInfo.nameList[roomId].length){
                io.in(roomId).emit("receiveGameStatus", gameName, roomInfo.gameRoom[roomId.toString()][path.toString()].includes('gaming'));
            }

        });


    });
}
