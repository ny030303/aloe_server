const server = require('./server');
const {db} = require('./models');
const { ObjectId } = require('mongodb');
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
        // console.log(user[idx].user_data.id + "님이 로그아웃 했습니다.");
        console.log(userList);
    });

    socket.on('add-group', (data) => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);

        // console.log(data, userList[idx]);
        db.group.insert({
            "title": data,
            "users": [{'_id': new ObjectId(userList[idx].user_data._id), 'profileURL': userList[idx].user_data.profileURL, 'name': userList[idx].user_data.name}],
            "contents": []
        });
        socket.emit('add-group-ok', true);
    });

    socket.on('write-message', async (data) => {
        //  group.. {_id: "", massage: ""}
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        let g_id = new ObjectId(data._id);
        // console.log("write-message: " + o_id);
        //와됐따 ,,,,,,, ㅜㅜㅜㅜㅜㅜ
        let msgData = {
            'user_id': new ObjectId(userList[idx].user_data._id),
            'created': new Date().toISOString(),
            'message': data.message
        };
        
        await db.group.updateOne(
            { "_id": g_id},
            { "$push": { 
                "contents": msgData
            }} , {multi: true}
        );
        let groupInfo = await db.group.findOne({ "_id": g_id});
        console.log(groupInfo);

        userList.forEach(val1 => {
            groupInfo.users.forEach(val2 => {
                console.log(val1.socket_id);
                if(val1.user_data._id == val2._id) {
                    console.log("val1.user_data._id == val2._id: ", val1.user_data._id , ", ", val2._id);
                    io.to(val1.socket_id).emit('new-message', {_id: data._id, message: msgData});
                }
            });
        });
        // 특정 소켓 id를 가진 클라이언트에게 new message 남기기 해야함
        // io.sockets https://itzone.tistory.com/450
        // socket.emit('new-message', {_id: userList[idx].user_data._id, users: g.users});
    });
    socket.on('show-a-group', async (id) => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        let o_id = new ObjectId(id);
        let g = await db.group.findOne({ "_id": o_id});
        console.log(g);
        socket.emit('show-a-group-ok', g);
    })

    socket.on('show-user-group', async () => {
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        // console.log(userList[idx].user_data._id, userList[idx].user_data);
        let g = await db.group.find({ 
            "users": { 
            $all: [{
                '_id': new ObjectId(userList[idx].user_data._id),
                'profileURL': userList[idx].user_data.profileURL,
                'name': userList[idx].user_data.name
            }]
        }} ).toArray();
        console.log(g);
        socket.emit('show-user-group-ok', g);
        // console.log(group);
    });

    socket.on('disconnect', ()=>{
        let idx = userList.findIndex(x => x.socket_id === socket.id);
        if(idx < 0) return;
        console.log(userList[idx].user_data.name + " 새로고침"); // 새로고침 하면 list에서 지운다.
        let user = userList.splice(idx, 1);
        // io.emit('user-list', userList);
        
    });

    // socket.on('chat msg', data => {
    //     let sendUser = userList.find(x => x.id === socket.id);
    //     io.emit('awesome', {user: sendUser, msg: data});
    // });
});

module.exports = {userList};