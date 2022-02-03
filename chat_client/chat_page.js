
const ip_adress = "192.168.0.40";
const msg_name = "chat_client/user_messages.txt"

function interpret_data(s, max_cnt = 10){
    let q = s.split('\n');
    let res = [];

    for(let i = q.length-1 ; i >= 0 && (q.length-1 - i) < max_cnt; i--){
        let r = q[i];
        let pair = r.split('|');
        res.push(pair);
    }
    return res;
}

async function get_user(){
    let t = await fetch("request_session_data.php", {
        method : "POST",
        body : "username",
    });

    console.log(t);
    let r = await t.text();
    console.log(r);
    return r;
}

async function get_profile_picture_path(user){
    let t = await fetch("get_profile_picture.php", {
        method:"post",
        body: user
    });
    let r = await t.text();
    console.log(r);
    return r;
}


async function update_chatwindow(){
    let s = await load_msg_data();
    let res = interpret_data(s);
    let container = document.getElementById("chat_messages");

    container.innerHTML = "";
    for(let i = 0; i < res.length; i++){
        container.innerHTML = container.innerHTML + '<b>' + '[' + res[i][0] + ']' + '</b>' +  ": " + res[i][1] + "<br>";
    }
}

async function send_message(){
    let s = document.getElementById("input_field").value;
    console.log(s);
    s.trim();
    if(s.length == 0) return;
    console.log("attempting to send message")

    let request = new XMLHttpRequest();
    request.open("post", "submit_message.php");
    request.onload = function(){
        console.log(request.status);
        if(request.status != 200){
            console.log("send request failed");
        }else{
            console.log(request.responseText);
            update_chatwindow();
        }
    }
    request.send(s)
}

async function load_msg_data(){
    _promise = new Promise(function(myResolve, myReject){
        let request = new XMLHttpRequest()
        request.open("GET", "chat.txt");
        request.responseType = "text";
        request.setRequestHeader("Cache-Control", "no-cache");
        request.setRequestHeader("Cache-Control", "no-store");
        request.setRequestHeader("Cache-Control", "must-revalidate");
        request.setRequestHeader("pragma", "no-cache");
        

        request.onload = function(){
            if(request.status == 200){
                myResolve(request.response);
            }else{
                myReject(false);
            }
        }
        request.send();
    })
    let s = await _promise;
    return s;
}

function stringToBytes ( str ) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++ ) {
      ch = str.charCodeAt(i);  // get char 
      st = [];                 // set up "stack"
      do {
        st.push( ch & 0xFF );  // push byte to stack
        ch = ch >> 8;          // shift value down by 1 byte
      }  
      while ( ch );
      // add stack contents to result
      // done because chars have "wrong" endianness
      re = re.concat( st.reverse() );
    }
    // return an array of bytes

    let byte_s = "";
    for(let i = 0; i < re.length; i++){
        byte_s = byte_s + re[i] + " ";
    }

    return byte_s;
  }

function snuskig_update(user){
    user = user.trim();
    if(user != "HOLGER"){
        let header_element = document.getElementById("snuskig_label");
        header_element.style.display = "none";
    }
}

async function update_page(){
    update_chatwindow();
    let s = await get_user();
    if(s == -1){
        window.location.href = "index.html"; return;
    }
    snuskig_update(s);
    let pic_element = document.getElementById("profile_picture");
    document.getElementById("username_header").innerHTML = s;
    let path = await get_profile_picture_path(s);
    if(typeof(path) == "string"){console.log("is string yes")};

    path.trim();
    console.log(path);
    //console.log(stringToBytes(path));
    //console.log(path.length)

    //console.log(stringToBytes("./uploads/Anton_picture.jpg"));
    //console.log("./uploads/Anton_picture.jpg".length);
    pic_element.setAttribute("src", path);
}

async function auto_update(){
    setInterval(update_chatwindow, 500);
}

async function on_logout_click(){
    let t = await fetch("logout.php", {
        method: "post"
    });
    await t.text();
    window.location.href = "index.html";
}

console.log("test2");
window.onload = function(){
    update_page();
    auto_update();
    //load_msg_data();
}