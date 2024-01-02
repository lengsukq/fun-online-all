const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const BizResult = require("../utils/BizResult");
const commonGitPull = (req, res, path) => {
    // 获取请求体中的事件类型
    const eventType = req.headers['x-gitee-event'];
    console.log('eventType', eventType)
    // 只处理 push 事件
    if (eventType === 'push_hooks' || eventType === 'Push Hook') {
        // 执行 shell 命令来拉取最新代码
        exec(`cd ${path} && git pull`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                res.status(500).send('Error during deployment');
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.send(BizResult.success(`Code updated successfully:${eventType}`))
        });
    } else {
        // 其他事件类型不做处理
        res.send(BizResult.fail(`Event not supported:${eventType}`))
    }
}

router.post('/fun-online', (req, res) => {
    commonGitPull(req, res, '/home/leng/code/fun-online');
});
router.post('/fun-online-api', (req, res) => {
    commonGitPull(req, res, '/home/leng/code/fun-online-api');
});
router.post('/love-trick', (req, res) => {
    commonGitPull(req, res, '/home/leng/code/love-trick');
});
module.exports = router;
