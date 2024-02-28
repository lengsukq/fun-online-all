// 引入axios模块
const axios = require('axios');
const mysql = require("mysql");
require('dotenv').config({path: `../.env.local`})
const getList = async (token) => {
    await axios.get(`${process.env.LUCKY_APIIP}/api/stunrulelist`, {
        headers: {
            'Authorization': `${token}`
        },
    })
        .then(response => {
            // 处理获取到的数据
            // console.log('成功获取数据：', response.data);
            let project = [];
            response.data.list.forEach(item => {
                    // 内网穿透配置名称
                    if (item.Name === 'fun-online') {
                        aliddns({
                            "DomainName": "honghupetrel.fun",
                            "RecordId": '869590194016073728',
                            "RR": "nav",
                            "Type": "REDIRECT_URL",
                            "Value": `http://transit.honghupetrel.fun:${item.PublicAddr.split(':')[1]}`
                        });
                        aliddns({
                            "DomainName": "honghupetrel.fun",
                            "RecordId": '869722673439928320',
                            "RR": "transit",
                            "Type": "A",
                            "Value": `${item.PublicAddr.split(':')[0]}`
                        });
                    } else if (item.Name === 'fun-online-api') {
                        setFunOnlineApi(`http://${item.PublicAddr}`)
                        // 修改指向ip地址
                        setCloudflareInfo('put',
                            {
                                content: item.PublicAddr.split(':')[0],
                                name: "to.lengsu.top",
                                proxied: false,
                                type: "A",
                                comment: "",
                                tags: [],
                                ttl: 1
                            },
                            'https://api.cloudflare.com/client/v4/zones/050d6b0bddb33ad75e97ee61361e1909/dns_records/df20e33d2cceafd287afe2f11fb0ab58'
                        )
                        // 修改funapi指向端口
                        setCloudflareInfo('patch',{
                                "expression": "(http.host eq \"funapi.lengsu.top\")",
                                "description": "funapi",
                                "action": "route",
                                "action_parameters": {
                                    "origin": {
                                        "port": Number(item.PublicAddr.split(':')[1])
                                    }
                                }
                            },
                            'https://api.cloudflare.com/client/v4/zones/050d6b0bddb33ad75e97ee61361e1909/rulesets/943d61a4472f4682b43740125886f960/rules/4ca29f8df67f4cf98d5960951a02b480'
                        )
                    }

                    project.push({
                        projectURL: item.PublicAddr,
                        projectName: item.Name
                    })
                }
            )
            console.log('project', project);
            mysqlAct(project);
        })
        .catch(error => {
            // 处理错误
            console.error('获取数据时出错：', error);
        });
}
const postData = async () => {
    const apiUrl = process.env.LUCKY_APIIP + "/api/login"; // 请将URL替换为实际的API接口URL
    console.log('postData', apiUrl)
    await axios.post(apiUrl, {"Account": process.env.LUCKY_ACCOUNT, "Password": process.env.LUCKY_PASSWORD, "TwoFA": ""}, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // 处理获取到的数据
            console.log('成功获取数据：', response.data);
            // 在这里可以对获取到的数据进行处理或者其他操作
            getList(response.data.token);
        })
        .catch(error => {
            // 处理错误
            console.error('获取数据时出错：', error);
        });
}
const mysqlAct = (projects) => {
    const mysql = require('mysql');

// 创建 MySQL 数据库连接
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST, // 主机名
        port: process.env.MYSQL_PORT,   // MySQL 默认端口为 3306
        user: process.env.MYSQL_USER,   // 使用 root 用户登入 MySQL
        password: process.env.MYSQL_PASSWORD, // MySQL 密码，用你自己的
        database: process.env.MYSQL_DATABASE // 使用数据库
    });

    connection.connect();
    // 构建 INSERT INTO 语句
    const insertQuery = 'INSERT INTO projectdata (projectURL, projectName) VALUES ? ON DUPLICATE KEY UPDATE projectURL = VALUES(projectURL);';

    // 将项目数据转换为二维数组
    const values = projects.map(project => [project.projectURL, project.projectName]);
    // console.log('将项目数据转换为二维数组',[values,values[1]])
    // 执行插入操作
    connection.query(insertQuery, [values], (error, results) => {
        if (error) {
            console.error('插入数据时发生错误：', error);
        } else {
            console.log('成功插入数据！');
        }

        // 关闭数据库连接
        connection.end();
    });
}
const aliddns = (params) => {
    // console.log('阿里云解析',params)
    const Core = require('@alicloud/pop-core');
    let client = new Core({
        accessKeyId: process.env.ALIDNS_KEYID,
        accessKeySecret: process.env.ALIDNS_KEYSECERT,
        endpoint: 'https://alidns.aliyuncs.com',
        apiVersion: '2015-01-09'
    });
    let requestOption = {
        method: 'POST'
    };
    client.request('UpdateDomainRecord', params, requestOption).then((result) => {
        console.log(JSON.stringify(result));
    }, (ex) => {
        // console.log(ex);
    })
}
// 修改fun-online项目的api地址
const setFunOnlineApi = (url) => {
    const fs = require('fs');

// 读取.env.local文件内容
    fs.readFile('../../fun-online/.env.local', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // 找到需要修改的参数并进行替换
        let modifiedData = data.replace(/VITE_API=.*/, `VITE_API=${url}`);

        // 将更改后的内容写回文件中
        fs.writeFile('../../fun-online/.env.local', modifiedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('File updated successfully!');
        });
    });

}
const setCloudflareInfo = (reqType,data, url) => {
    axios[reqType](url, data, {
        headers: {
            'Content-Type': 'application/json',
            // 根据 Cloudflare API 要求，您可能需要在请求头中提供认证信息（例如 API 密钥）
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API}`,
        }
    })
        .then(response => {
            console.log('请求成功', response.data);
        })
        .catch(error => {
            console.error('请求失败', error);
        });
}

// aliddns();
// setFunOnlineApi();
// setCloudflareDNS();
// 发起请求获取数据
postData().then(r => {
});
