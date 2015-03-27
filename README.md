
# nrp

一个使用 Node.js 编写的反向代理服务器。

极简风格，支持 HTTPS，支持端口配置，支持子域名、多域名和多服务器。


## 安装
```sh
$ npm install -g nrp
or
$ sudo npm install -g nrp
```

## 配置

为了访问配置文件，需要知道 Node.js 环境的全局模块安装路径。
```sh
$ echo $NODE_PATH  # 查看环境变量
$ npm root -g  # 查看全局模块路径
$ npm get prefix  # 查看 prefix
$ NRP_PATH=`npm root -g`  # 设置 nrp 路径环境变量
```
假设需要代理服务器运行在 80 端口，www 主站和 blog 子站分别运行在本机端口 3000 和端口 4000，配置文件如下：

```sh
$ vi $NRP_PATH/nrp/config.json
```
```js
{
  "port": 8080,
  "ssl": false,
  "key": "./nrp-key.pem",
  "cert": "./nrp-cert.pem",
  "www.name.com": {
    "host": "127.0.0.1",
    "port": 3000
  },
  "blog.name.com": {
    "host": "127.0.0.1",
    "port": 4000
  }
}
```

提示：HTTP 服务缺省端口是 80，HTTPS 是 443。使用 80 或 443 端口需要 sudo 权限。


## 密钥

为支持 HTTPS，需要 SSL 密钥文件，nrp 内置了自签名的 SSL 密钥文件。使用浏览器访问自签名 https 网站，需要选择信任。

可以修改配置文件 config.json 使用自己的密钥，也可以使用 openssl 重新生成自签名密钥。方法如下：

```sh
$ openssl genrsa -out nrp-key.pem 1024
$ openssl req -new -key nrp-key.pem -out nrp-cert.csr
$ openssl x509 -req -in nrp-cert.csr -signkey nrp-key.pem -out nrp-cert.pem
```

## 启动
```sh
$ nrp
or
$ sudo nrp
```
简单 control + c 即可退出。


## 服务

可以使用 upstart 将 nrp 配置为系统服务，操作如下：
```sh
$ sudo vi /etc/init/nrp.conf

start on runlevel [2345]
stop on shutdown

respawn  # 自动重启
respawn limit 10 10  # 尝试10次，间隔10秒

script
    nrp 2>&1 >> /dev/null
end script
```
查看、启动或停止服务命令如下：
```sh
$ sudo status nrp  # 查看状态
$ sudo start nrp  # 启动服务
$ sudo stop nrp  # 停止服务
```


## 协议

MIT
