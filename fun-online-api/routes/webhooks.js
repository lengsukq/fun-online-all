const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const BizResult = require("../utils/BizResult");
const commonGitPull = (req, res, command) => {
    // 获取请求体中的事件类型
    const eventType = req.headers['x-gitee-event'];
    console.log('eventType', eventType)
    // 只处理 push 事件
    if (eventType === 'push_hooks' || eventType === 'Push Hook') {
        res.send(BizResult.success(`Code updated successfully:${eventType}`))
        // 执行 shell 命令来拉取最新代码
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                res.status(500).send('Error during deployment');
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    } else {
        // 其他事件类型不做处理
        res.send(BizResult.fail(`Event not supported:${eventType}`))
    }
}

router.post('/fun-online', (req, res) => {
    commonGitPull(req, res, 'cd /home/leng/code/fun-online && git pull && yarn build');
});
router.post('/fun-online-api', (req, res) => {
    commonGitPull(req, res, 'cd /home/leng/code/fun-online-api && git pull');
});
router.post('/love-trick', (req, res) => {
    commonGitPull(req, res, 'cd /home/leng/code/love-trick && git pull && yarn build && pm2 reload love');
});
module.exports = router;
