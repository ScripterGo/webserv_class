

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

async function redirect(){
    res = await get_user();
    if(res != -1){
        window.location.href = "chat_page.html";
    }
}
redirect();