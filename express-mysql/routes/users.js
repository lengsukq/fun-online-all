const express = require('express');
const router = express.Router();
const connection = require('../src/db'); // 获取连接实例
const BizResult = require('../utils/BizResult');

/* GET users listing. */
router.get('/getSUsersInfo', function (req, res, next) {

    connection.query('select * from user', (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            // 将 MySQL 查询结果作为路由返回值
            res.send(BizResult.success(result))
        }
    })
});
router.get('/changeName', function (req, res, next) {
    console.log('req.query', req.query.name)

    const sql = `update user set name='${req.query.name}',phone='${req.query.phone}',keywords='${req.query.keywords}' where id=${req.query.id}`
    console.log(sql)
    /* 使用 connection.query 来执行 sql 语句 */
    // 第一个参数为 sql 语句，可以透过 js 自由组合
    // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
    connection.query(sql, (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            // 将 MySQL 查询结果作为路由返回值
            res.send(BizResult.success(result))
        }
    })
});
module.exports = router;
