# jsdeploy

安装该工具
```
$ npm i jsdeploy -g
```

```
# 初始化项目部署配置文件
$ jsdeploy init 
# 初始化本地和服务器部署目录结构
$ jsdeploy setup -e staging
# 编辑打包本地代码
$ jsdeploy build -e staging
# 部署到服务器
$ jsdeploy deploy -e staging
# 回滚最后一次部署
$ jsdeploy rollback -e staging
# 清理本地部署临时文件
$ jsdeploy clean
```

### 如无需回滚功能
```json
{
  "scripts": {
    "deploy-prod": "npm run build && scp -r ./dist/* deploy@120.77.252.**:/mnt/www/huobi/huobi-admin"
  }
}
```
