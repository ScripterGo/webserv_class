
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const server_ip = "192.168.0.40";

var ip_adress = "10.32.32.189";
var port = ":3000";
var base_url = "http://" + ip_adress + port;
var url = [base_url + "/0", base_url + "/1"];
const socket = io('ws://' + server_ip + ':5050');
var mouse_pos = {x:0, y:0};

function connect_mouse(){
    window.onmousemove = function(mouse_event){
        //console.log(mouse_event.clientX, mouse_event.clientY);
        mouse_pos = {x: mouse_event.clientX, y: mouse_event.clientY};
    }
}

function get_num_from_bool(bool){
    return bool == false ? 0 : 1;
}

/*
socket.addEventListener('message', function(event){
    console.log("Message from server! ", event.data);
})
*/
/*
async function get_data(idx){
    //console.log(idx);
    console.log(url[idx]);
    let response = await fetch(url[idx], {
            method: "GET",
            //mode: "no-cors",
            referrerPolicy: "unsafe-url"
        }    
    )
    if(response.ok){return await response.json();}
    throw new Error(`Error from server ${response.status}: ${response.statusText}`);
}

async function post_data(idx){
    let response = await fetch(url[idx], {
        method: "post",
        //mode: "no-cors",
        headers:{
            'Content-Type': 'application/json'
        },
        referrerPolicy: "unsafe-url",
        body: JSON.stringify(mouse_pos)
    });    
}
*/
async function post_data_socket(){
    socket.emit("update", JSON.stringify(mouse_pos));
}

window.onload = function(){
    let box1 = document.getElementById("box1");
    let box2 = document.getElementById("box2");
    let boxes = [box1, box2];
    let player = 0;
    connect_mouse();
    
    socket.on("get-return", (arg) => {
        //console.log(arg);
        let data = JSON.parse(arg);
        let ot_player = get_num_from_bool(!player);
        boxes[ot_player].style.left = data.x;
        boxes[ot_player].style.top = data.y;
    })

    socket.on("winner", function(){
        console.log("I just won!!!!");
    })
    
    async function do_frame(){
        boxes[player].style.left = mouse_pos.x;
        boxes[player].style.top = mouse_pos.y;

        //let data = await get_data(ot_player);
        //console.log(data);
        socket.emit("get");
        post_data_socket();
        //post_data(player);
        //socket.send("test?");
    }

    async function game_loop(){
        setInterval(function(){
            do_frame();
        }, 25);
    }

    game_loop();
};
