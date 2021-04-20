const app = require('./app');
const http = require('http');  //노드의 기본 모듈
const server = http.createServer(app);

module.exports = server;