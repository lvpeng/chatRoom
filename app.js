/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 11/28/13
 * Time: 9:36 AM
 * To change this template use File | Settings | File Templates.
 */


var  express = require('express')
    ,app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

//TODO : 服務器檢查昵稱的唯一性；
var nicknames = [];

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('nickname',function(data){

        if(nicknames.indexOf(data) === -1){
           nicknames.push(data);
            socket.broadcast.emit('name', data);
        }else{
            socket.emit('warn',{msg:'昵稱'+ data+'已經存在，請重新輸入!'});
        }
    });
    socket.on('disconnect',function(data){
        socket.broadcast.emit('exit', data + 'exit');
        //console.log('user  exit!' );
    });
});

server.listen(3000);
console.log("Express server listening on port 3000");