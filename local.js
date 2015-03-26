'use strict';

var http = require('http');

var s1 = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Server1\n');
}).listen(3001, '127.0.0.1');

var s2 = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Server2\n');
}).listen(3002, '127.0.0.1');
