const express = require('express');
const BizResult = require("../utils/BizResult");
const router = express.Router();
const executeQuery = require('../utils/db'); // 获取连接实例
/* GET home page. */
router.get('/fun-admin', function (req, res, next) {

    const data = req.query;
    console.log(data.adminPassWord)
    if (data.hasOwnProperty('adminPassWord') && data.adminPassWord === 'lovehaifei') {
        executeQuery({query: 'select * from projectdata WHERE isAdmin =1 AND isEnable = 1'}).then(result => {
            if (result.err) {
                console.log('err', result.err)
                res.send(BizResult.fail(result.err))
            } else {
                let newData = []
                result.forEach(item => {
                    newData.push({
                        name: item.projectName,
                        path: item.luckyURL ? item.luckyURL : item.projectURL,
                        luckyURL: item.luckyURL,
                        ipv6URL: item.ipv6URL,
                        icon: item.icon,
                        iconURL: item.iconURL
                    })
                })
                // 将 MySQL 查询结果作为路由返回值
                res.send(BizResult.success(newData, '验证成功'))
            }
        })
    } else {
        res.send(BizResult.fail({}, '验证失败'))

    }
});
router.get('/nav-list', function (req, res, next) {

    // const data = req.query;
    executeQuery({query: 'select * from projectdata WHERE isAdmin =0 AND isEnable = 1'}).then(result => {
        if (result.err) {
            console.log('err', result.err)
            res.send(BizResult.fail(result.err))
        } else {
            let newData = []
            result.forEach(item => {
                newData.push({
                    name: item.projectName,
                    path: item.luckyURL ? item.luckyURL : item.projectURL,
                    luckyURL: item.luckyURL,
                    ipv6URL: item.ipv6URL,
                    icon: item.icon,
                    iconURL: item.iconURL
                })
            })

            // 将 MySQL 查询结果作为路由返回值
            res.send(BizResult.success(newData))
        }
    })

});

module.exports = router;
