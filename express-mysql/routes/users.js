const express = require('express');
const router = express.Router();
const connection = require('../src/db'); // 获取连接实例
const BizResult = require('../utils/BizResult');

/* GET users listing. */
router.get('/getSUsersInfo', function (req, res, next) {

    connection?.query('select * from user', (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            // 将 MySQL 查询结果作为路由返回值
            res.send(BizResult.success(result))
        }
    })
});
router.get('/changeUser', function (req, res, next) {
    console.log('req.query', req.query.name)

    const sql = `update user set name='${req.query.name}',phone='${req.query.phone}',keywords='${req.query.keywords}' where id=${req.query.id}`
    /* 使用 connection.query 来执行 sql 语句 */
    // 第一个参数为 sql 语句，可以透过 js 自由组合
    // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
    connection?.query(sql, (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            if (result.affectedRows === 0){
                console.log('result',result)
                res.send(BizResult.fail('请输入正确的id'))
            }else{
                res.send(BizResult.success('修改成功'))
            }
        }
    })
});
// 新增用户
router.post('/addUser', function (req, res, next) {
    console.log('req.body', req.body)
    let data = req.body;

    for (let item in data){
        console.log('item',item)
        if (!data[item]){
            res.send(BizResult.fail('请输入完整信息'))
            return;
        }
    }

    connection?.query(`select count(*) from user where id=${data.id}`, (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            console.log('查询id是否存在',result)
            if (result[0]['count(*)'] > 0) {
                res.send(BizResult.fail('用户已存在'));
                return;
            }
        }
    })


    const sql = `insert into user value(${data.id},'${data.name}','${data.phone}','${data.keywords}')`
    /* 使用 connection.query 来执行 sql 语句 */
    // 第一个参数为 sql 语句，可以透过 js 自由组合
    // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
    connection?.query(sql, (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            // 将 MySQL 查询结果作为路由返回值
            res.send(BizResult.success('新增成功'))
        }
    })
});
// 删除
router.delete('/deleteUser', function (req, res, next) {
    console.log('req.body', req.body)
    let data = req.body;

    if (!data.id){
        res.send(BizResult.fail('id 不能为空'));
        return;
    }

    const sql = `delete from user where id=${data.id}`

    /* 使用 connection.query 来执行 sql 语句 */
    // 第一个参数为 sql 语句，可以透过 js 自由组合
    // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
    connection?.query(sql, (err, result) => {
        if (err) {
            res.send(BizResult.fail(err))
        } else {
            //insertId 是插入的 ID；affectedRows 是受影响的行数；changedRows 返回更新了多少行
            if (result.affectedRows === 0){
                console.log('result',result)
                res.send(BizResult.fail('该用户不存在'))
            }else{
                res.send(BizResult.success('删除成功'))
            }
            // 将 MySQL 查询结果作为路由返回值
        }
    })
});

module.exports = router;
