'use strict';

var nrp = require('../');
var http = require('http');
var https = require('https');
var assert = require("assert")
var superagent = require('superagent');

var s1 = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Server1\n');
}).listen(3001, '127.0.0.1');

var s2 = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Server2\n');
}).listen(3002, '127.0.0.1');

var p = new nrp.proxy_ssl(0).listen(8081, '0.0.0.0');

describe('HTTPS Proxy', function(){
  it('should return Server1', function(){
    superagent
    .get('https://127.0.0.1:8081/')
    .end(function (err, res) {
      if (!err) {
        assert.equal('Server1', res.text.trim());
      }
    });
  })
  it('should return Server2', function(){
    superagent
    .get('https://localhost:8081/')
    .end(function (err, res) {
      if (!err) {
        assert.equal('Server2', res.text.trim());
      }
    });
  })
})
