const server = require('./server');
const {db} = require('./models');

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
let connectSocket;
io.on("connect", socket => {
    console.log(socket.id + " 연결");
    connectSocket = socket;
    socket.on('login-check', data => {
       console.log(userList);
        let idx = -1;
        if(userList.length > 0 && data.id) idx = userList.findIndex(x => x.user_data.id === data.id);
        if(idx < 0) return;
        userList.forEach((v, i) => {
            if(i === idx) v.socket_id = socket.id;
        });
        socket.emit('login-ok', {socket_id:socket.id, user_data:data});

    });

    socket.on('login', data => {
        userList.push({socket_id:socket.id, user_data:data});
        socket.emit('login-ok', {socket_id:socket.id, user_data:data});
        console.log(userList);
        // io.emit('user-list', userList);
    });

    socket.on('logout', ()=>{
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        if(idx < 0) return;
        
        let user = userList.splice(idx, 1);
        // io.emit('user-list', userList);
        console.log(user[idx].user_data.id + "님이 로그아웃 했습니다.");
        console.log(userList);
    });

    socket.on('addGroup', (data) => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);

        // console.log(data, userList[idx]);
        db.group.insert({
            "title": data,
            "users": [{'_id': userList[idx].user_data._id, 'name': userList[idx].user_data.name}],
            "contents": []
        });
        socket.emit('addGroup-ok', true);
    });

    socket.on('show-user-group', async () => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        // console.log("show-user-group list user: ",userList[idx]);

        let group = await db.group.find({ "users": { $all: [{'_id': userList[idx].user_data._id, 'name': userList[idx].user_data.name}]}} ).toArray();
        socket.emit('show-user-group-ok', group);
        // console.log(group);
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

module.exports = {userList};