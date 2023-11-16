// 将server作为参数传入
const { Server } = require("socket.io");
module.exports = function (server) {
    let roomInfo = {
        nameList: [],
        nameId: {},
        gameRoom: {},
        userInfo: [],
    };

    //  cors: true 跨域允许，不然前端会报跨域错误
    let io = new Server(server, { cors: true });

    // socket.to（room）
    // room （串）
    // Socket链接返回
    // 为随后的事件发射设置一个修饰符，事件只会广播到已加入给定的客户端room（套接字本身被排除）。
    //
    // 要发射到多个房间，可以to多次打电话。

    // socket.in（room）
    // socket.to（房间）的同义词。
    io.on("connect", (socket) => {
        // 获取用户信息
        const userId = socket.id;
        const ip = socket.remoteAddress;
        const port = socket.remotePort;

        // 处理用户信息
        console.log(`用户 ${userId} 连接成功，IP 地址为 ${ip}，端口号为 ${port}`);
        // 加入房间并通知
        socket.on("join", ({ roomId, name }) => {
            console.log(`${name}进入[${roomId}房间]`);
            if (roomInfo.nameList[`${roomId}`]) {
                roomInfo.nameList[`${roomId}`].push(name);
            } else {
                roomInfo.nameList[`${roomId}`] = [name];
            }
            roomInfo.nameId[name] = userId;
            console.log('roomInfo.nameId', roomInfo.nameId)
            socket.join(roomId);
            io.in(roomId).emit("say", { name: name, roomId: roomId, status: 'join' });
        });
        // 离开房间并通知
        socket.on("leave", ({ roomId, name }) => {
            console.log(`${name}离开[${roomId}房间]`, roomInfo.nameList[roomId]);
            roomInfo.nameList[roomId] = roomInfo.nameList[roomId] ? roomInfo.nameList[roomId].filter((item) => item !== name) : roomInfo.nameList[roomId];
            io.in(roomId).emit("say", { name: name, roomId: roomId, status: 'leave' });
            socket.leave(roomId);
        });

        // 通过房间号发送消息
        socket.on("sendMsgByRoom", ({ roomId, name, msg }) => {
            console.log(`${name}发送消息到[${roomId}房间]:`, msg);
            io.in(roomId).emit("receiveMsg", socket.id, name, msg);
        });

        // 获取当前在线人数
        socket.on("sendRoomId", ({ roomId }) => {
            console.log('当前roomId', roomId)
            io.in(roomId).emit("getOnlineNumber", roomInfo.nameList[roomId]);
        });

        // 游戏数据传输
        socket.on("sendGameInfo", ({ name, roomId, gameInfo }) => {
            console.log(`${name}传输游戏数据到[${roomId}房间]:`, gameInfo);
            io.in(roomId).emit("receiveGameInfo", gameInfo);
        });
        let sendUserId;
        // 发送房间游戏状态
        socket.on("sendGameStatus", ({ roomId, path, actType }) => {
            console.log(`sendGameStatus-roomId:${roomId},path:${path},actType:${actType}`);
            sendUserId = socket.id;
            roomInfo.gameRoom = {};
            upDataUserInfo(roomId, path, actType);

        });

        // 主动更新用户数据
        function upDataUserInfo(roomId, orderPath, actType) {
            // 向房间所有人发送广播，更新房间数据
            console.log('向房间所有人发送广播，更新房间数据', orderPath, actType)
            io.in(roomId).emit("receiveUpDateCommand", orderPath, actType);
        }

        // 接收用户数据
        socket.on("sendUserInfo", ({ roomId, name, path, gameStatus, orderPath, actType }) => {
            console.log(`roomId:${roomId},name:${name},path:${path},gameStatus:${gameStatus},orderPath:${orderPath},actType:${actType}`);
            roomInfo.userInfo.push({
                roomId: roomId, name: name, path: path, gameStatus: gameStatus
            })
            roomInfo.gameRoom[roomId.toString()] = roomInfo.gameRoom[roomId] ? roomInfo.gameRoom[roomId.toString()] : {};
            // 加入房间的判断
            if (actType === 'joinRoom') {
                if (orderPath === path) {

                    if (roomInfo.gameRoom[roomId.toString()][orderPath] instanceof Array) {
                        roomInfo.gameRoom[roomId.toString()][orderPath].push(gameStatus)
                    } else {
                        roomInfo.gameRoom[roomId.toString()][orderPath] = [gameStatus];
                    }
                }
                if (roomInfo.userInfo.length === roomInfo.nameList[roomId].length) {
                    roomInfo.userInfo = [];
                    if (roomInfo.gameRoom[roomId.toString()][orderPath]) {
                        console.log('最终传输数据', orderPath, roomInfo.gameRoom[roomId.toString()][orderPath].includes('gaming'));
                        io.to(sendUserId).emit("receiveGameStatus", orderPath, roomInfo.gameRoom[roomId.toString()][orderPath].includes('gaming'));
                    } else {
                        io.to(sendUserId).emit("receiveGameStatus", orderPath, false);
                    }
                    roomInfo.gameRoom[roomId.toString()][orderPath] = []
                }
            } else if (actType === 'getAllPath') {
                if (roomInfo.gameRoom[roomId.toString()][path] instanceof Array) {
                    if (!roomInfo.gameRoom[roomId.toString()][path].includes(name)) {
                        roomInfo.gameRoom[roomId.toString()][path].push(name)
                    }
                } else {
                    roomInfo.gameRoom[roomId.toString()][path] = [name];
                }
                if (roomInfo.userInfo.length === roomInfo.nameList[roomId].length) {
                    roomInfo.userInfo = [];

                    console.log('getAllPath传输数据', roomInfo.gameRoom[roomId.toString()][orderPath])
                    io.to(sendUserId).emit("receiveAllPath", orderPath, roomInfo.gameRoom[roomId.toString()][orderPath]);
                }

            }



        });


    });
}
