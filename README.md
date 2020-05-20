仓库管理客户端
===
# 调试
1. 启动ServerManagment
2. 启动GatewayServer
3. 启动ApplicationServer/ProdogBoot
4. 启动Wms客户端
```
npm run dev
```
5. Chrome浏览器打开网址`http://127.0.0.1:80/wmsapp/`，可以进行调试。
> 已经取消了dynamicIp的配置，尽量做到免配置。
> 80端口是GatewayServer的启动端口，由80端口跳转到仓库客户端的网址8083。相关的配置如下：

```
routes:
    # 正式的环境去掉该配置
    wmsclient:
      path: /wmsapp/**
      url: http://127.0.0.1:8083
      strip-prefix: false
    # 正式的环境去掉该配置
    wmsclient-static:
      path: /static-wms-app/**
      url: http://127.0.0.1:8083
      strip-prefix: false      
```