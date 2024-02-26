bin/www :启动入口文件
public :静态资源目录
routes :路由目录
views :模板目录
app.js :主程序文件
package.json :包管理文件 

#[luckyAct.js](utils%2FluckyAct.js) 实现功能 
获取lucky后台的内网穿透信息，通过阿里云和cloudflare的api实现动态映射。
并且将数据写入数据库，方便后续使用接口查询。 
请注意，该文件不会自动执行，也不会通过任何接口调用执行，只能使用node环境执行。

#[webhooks.js](routes%2Fwebhooks.js) 实现功能 
通过gitee的webhoos功能自动拉取项目最新代码并且编译发布

#根目录添加.env.local文件
```text
MYSQL_HOST= 数据库地址
MYSQL_PORT= 数据库端口
MYSQL_DATABASE= 数据库名称
MYSQL_USER= 数据库用户名
MYSQL_PASSWORD= 数据库密码
LUCKY_APIIP= Lucky后台地址
LUCKY_ACCOUNT = Lucky后台账号
LUCKY_PASSWORD = Lucky后台密码
ALIDNS_KEYID= 阿里云keyID
ALIDNS_KEYSECERT= 阿里云key密码
CLOUDFLARE_API= CF api令牌

```
