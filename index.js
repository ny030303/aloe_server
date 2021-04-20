const app = require('./app');
const server = require('./server');
const {userList} = require('./socket');

server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});