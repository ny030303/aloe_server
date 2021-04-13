const app = require('./app');
const http = require('http');  //노드의 기본 모듈
const server = http.createServer(app);
const io  = require('socket.io')(server, {
    cors: {
    //   origin: "http://localhost:3000",
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
// const io = socket(server);

let userList = []; //로그인한 유저들을 저장하는 배열
io.on("connect", socket => {
    console.log(socket.id + " 연결");

    socket.on('login-check', data => {
        // console.log("login check in: ");
        // console.log(userList);
        // console.log(data);
        let idx = -1;
        if(userList.length > 0) idx = userList.findIndex(x => x.user_data.id === data.id);
        if(idx < 0) return;

        userList[idx].socket_id = socket.id;
        socket.emit('login-ok', {socket_id:socket.id, user_data:data});

       console.log(userList);
    });

    socket.on('login', data => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        if(idx > 0) return;
        userList.push({socket_id:socket.id, user_data:data});
        socket.emit('login-ok', {socket_id:socket.id, user_data:data});
        console.log(userList);
        // io.emit('user-list', userList);
    });

    socket.on('logout', ()=>{
        console.log("들어옴",  userList);
        // let idx = userList.findIndex(x => x.socket_id === socket.id);
        // console.log("idx: ", idx, " list[]: ", userList[idx]);
        // if(idx < 0) return;
        
        // let user = userList.splice(idx, 1);
        // io.emit('user-list', userList);
        // console.log(user.name + "님이 로그아웃 했습니다.");
    });

    // socket.on('disconnect', ()=>{
    //     let idx = userList.findIndex(x => x.socket_id === data.socket_id);
    //     if(idx < 0) return;
    //     let user = userList.splice(idx, 1);
    //     // io.emit('user-list', userList);
    //     console.log(user.name + "님이 접속을 종료했습니다.");
    // });

    // socket.on('chat msg', data => {
    //     let sendUser = userList.find(x => x.id === socket.id);
    //     io.emit('awesome', {user: sendUser, msg: data});
    // });
});

server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
  });