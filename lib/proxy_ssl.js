'use strict';

var https = require('https');
var http = require('http');
var url = require('url');
var fs = require('fs');
var config = require('../config.json');

var pk = fs.readFileSync(__dirname + '/' + config.key);
var pc = fs.readFileSync(__dirname + '/' + config.cert);
var opts = { key: pk, cert: pc };

var Proxy = function(echo) {

  return https.createServer(opts, function (sreq, sres) {

    // 请求的 主机名:端口号
    var host = sreq.headers.host;
    // 请求的 URL 信息，包括路径名
    var url_parts = url.parse(sreq.url, true);
    // 请求的 客户端 IP 地址
    var ip = sreq.headers['x-forwarded-for'] || sreq.connection.remoteAddress;

    if (echo) console.log("ip:" + ip + ", host:" + host + url_parts.pathname);

    // 分离端口号，保留主机名
    if (host.lastIndexOf(':') > 0) {
      host = host.substring(0, host.lastIndexOf(':'));
    }

    if (config[host]) {
      // 重定向服务器
      var opts = {
        host: config[host].host,
        port: config[host].port,
        path: url_parts.pathname,
        method: sreq.method,
        headers: sreq.headers
      };

      // 向重定向服务器发送请求，并建立数据通道
      var creq = http.request(opts, function(cres) {
        sres.writeHead(cres.statusCode, cres.headers);
        cres.pipe(sres);
      });
      sreq.pipe(creq);

      // 出错处理
      creq.on('error', function() {
        var message = 'Failed to connect to '+ opts.host +' port ' + opts.port;
        sres.writeHead(500, {'Content-Type': 'text/plain'});
        sres.end(message + '\n');
        console.log(message);
      });
    } else {
      // 没有重定向服务器，返回 echo 信息
      sres.writeHead(200, {'Content-Type': 'text/plain'});
      sres.end('Welcome to my server!\n');
    }

  });

}

module.exports = Proxy;
