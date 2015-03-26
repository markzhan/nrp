#!/usr/bin/env node
'use strict';

var nrp = require('./');
var program = require('commander');
var config = require('./package.json');

program
  .version(config.version)
  .option('-p, --port <number>', 'set port number')
  .option('-s, --ssl', 'https mode')

program.parse(process.argv);

// 代理服务器配置信息
var ssl = program.ssl || nrp.config.ssl;
var port = program.port || nrp.config.port;

// 创建代理服务器
var server;
if (ssl) {
  server = new nrp.proxy_ssl(1);
} else {
  server = new nrp.proxy(1);
}

// 启动代理服务器
server.listen(port, '0.0.0.0');
console.log("Listening on port %s", port);
