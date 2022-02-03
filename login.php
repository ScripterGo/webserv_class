

<?php

function print_real_string($s){
    for($i = 0; $i < strlen($s); $i++){
        print_r(ord($s[$i]) . " ");
    }
    print_r("\n");
}

function create_associative_array_2(){
    $servername = "127.0.0.1";
    $password = "7!ac@-q5c68VC!u";
    $username = "Ante0417";
    $db_name = "test";

    $q = "SELECT * FROM accounts";
    $connection = new mysqli($servername, $username, $password, $db_name);
    $res = $connection->query($q);
    $ans = array();

    for($i = 0; $i < $res->num_rows; $i++){
        $row = $res->fetch_assoc();
        $ans[$row["name"]] = $row["password"];
    }
    $connection->close();
    return $ans;
}

function create_associative_array(){
    $s = file_get_contents("accounts.txt");
    $curr_user = "";
    $curr_pass = "";
    $key_value = array();
    for($i = 0; $i < strlen($s); $i ++){
        while($s[$i] != '|'){
            $curr_user = $curr_user . $s[$i];
            $i ++;
        }
        $i ++;
        while($i < strlen($s) && $s[$i] != ';'){
            $curr_pass = $curr_pass . $s[$i];
            $i ++;
        }
        $key_value[$curr_user] = $curr_pass;
        $curr_user = "";
        $curr_pass = "";
    }
    return $key_value;
}

$A = create_associative_array_2();
//print_r($A);
$user = $_POST["username"];
$pass = $_POST["password"];

$flag = true;
foreach($A as $key => $val){
    if($user == $key && $pass == $val){
        echo("Login successful! <br>");
        $flag = false;
    }
}
if($flag == false){
    session_start();
    print_r("changing session");
    $_SESSION["username"] = $user;
    header("Location: chat_page.html");
}else{
    echo "Failed to login";
}
?>

