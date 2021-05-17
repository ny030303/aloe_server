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
io.on("connect", socket => {
    console.log(socket.id + " 연결");
  

    socket.on('login', data => {
        // session 값이 있는 클라이언트 or login 유저를 list에 넣는다.
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

    socket.on('group-user-write',(data) => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);

        // db.group.update(
        //     { _id: 1 },
        //     { $addToSet: { contents: {'name': userList[idx].user_data.name, 'texts': data.texts, } } }
        //  );
    });

    socket.on('show-user-group', async () => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        // console.log("show-user-group list user: ",userList[idx]);

        let group = await db.group.find({ "users": { $all: [{'_id': userList[idx].user_data._id, 'name': userList[idx].user_data.name}]}} ).toArray();
        socket.emit('show-user-group-ok', group);
        // console.log(group);
    });

    socket.on('disconnect', ()=>{
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        if(idx < 0) return;
        console.log(userList[idx].user_data.name + " 새로고침"); // 새로고침 하면 list에서 지운다.
        let user = userList.splice(idx, 1);
        // io.emit('user-list', userList);
        
    });

    socket.on('chat msg', data => {
        let sendUser = userList.find(x => x.id === socket.id);
        io.emit('awesome', {user: sendUser, msg: data});
    });
});

module.exports = {userList};