
const {Server} = require("socket.io");

const io = new Server(5050, {
    cors: {
        origin: "*"
    },
});

var sockets = [];
var player_count = 0;
var pos = [];

function get_num_from_bool(bool){
    return bool == false ? 0 : 1;
}

io.on("connection", (socket) => {
    console.log("client is trying to connect!");
    if(player_count > 2) return;
    let this_player = player_count;
    pos.push(JSON.stringify({x:0, y:0}));
    sockets.push(socket);
    player_count ++;

    socket.on("update", (arg) => {
        pos[this_player] = arg;
        if(player_count == 2){
            let pos_0 = JSON.parse(pos[0]);
            let pos_1 = JSON.parse(pos[1]);
            if(Math.abs(pos_0.x - pos_1.x) < 100 && Math.abs(pos_0.y - pos_1.y) < 100){
                console.log("found winner!");
                sockets[1].emit("winner");
            }
        }
    })

    socket.on("get", function(){
        //console.log(pos);
        if(player_count < 2){
            socket.emit("get-return", JSON.stringify({x:0, y:0}));
            return;
        }
        //console.log(!this_player);
        //console.log("sending back: ", pos[!this_player]);
        socket.emit("get-return", pos[get_num_from_bool(!this_player)]);
    });
})

const express = require("express");
var app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("client_folder"));
app.listen(3000);
//var player0_pos = null;
//var player1_pos = null;

/*
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // Pass to next layer of middleware
    next();
});
*/

function log_positions(){
    console.log(JSON.stringify(player0_pos) + "    " + JSON.stringify(player1_pos));
}

app.get("/", function(req, res){
    //res.append("Hello World!<br>");
    res.sendFile(__dirname + "/client_folder/game.html");
});
/*
app.post("/0", function(req, res){
    //console.log(`Player 0 posting data!`)
    player0_pos = req.body;
    res.status(200);
    res.send();
});
app.post("/1", function(req, res){
    //console.log(`Player 1 posting data!`);
    player1_pos = req.body;
    res.status(200);
    res.send();
})
app.get("/0", function(req, res){
    //console.log("Requesting player 0 data!");
    //console.log(player0_pos);
    if(player0_pos == null){
        res.status(200);
        res.send(JSON.stringify(new Position(0,0)));
        return;
    }

    res.send(JSON.stringify(player0_pos));
});
app.get("/1", function(req, res){
    //console.log("Requesting player 1 data!");
    //console.log(player1_pos);
    if(player1_pos == null){
        res.status(200);
        res.send(JSON.stringify(new Position(0,0)));
        return;
    }
    res.send(JSON.stringify(player1_pos));
});

*/