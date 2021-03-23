const app = require('./app');
const http = require('http');  //노드의 기본 모듈
const socket = require('socket.io');

const server = http.createServer(app);
const io = socket(server);

let userList = []; //로그인한 유저들을 저장하는 배열
io.on("connect", socket => {
    console.log(socket.id + "연결");

    // socket.on('login', data => {
    //     userList.push({id:socket.id, nickname:data});
    //     socket.emit('login-ok', {id:socket.id, nickname:data});
    //     io.emit('user-list', userList);
    // });

    // socket.on('disconnect', ()=>{
    //     let idx = userList.findIndex(x => x.id === socket.id);
    //     if(idx < 0) return;
    //     let user = userList.splice(idx, 1);
    //     io.emit('user-list', userList);
    //     console.log(user.nickname + "이 접속을 종료했습니다.");
    // });

    // socket.on('chat msg', data => {
    //     let sendUser = userList.find(x => x.id === socket.id);
    //     io.emit('awesome', {user: sendUser, msg: data});
    // });
});

server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
  });