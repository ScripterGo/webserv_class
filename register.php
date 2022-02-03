


<?php
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

    function make_entry($name, $pass){
        $file = fopen("accounts.txt", "a+");
        for($i = 0; $i < strlen($name); $i ++){
            fputs($file, $name[$i]);
        }
        fputs($file, '|');
        for($i = 0; $i < strlen($pass); $i ++){
            fputs($file, $pass[$i]);
        }
        fputs($file, ';');
        fclose($file);
    }

    function make_entry_2($name, $pass){

        $name = trim($name);
        $servername = "127.0.0.1";
        $password = "7!ac@-q5c68VC!u";
        $username = "Ante0417";
        $db_name = "test";

        $connection = new mysqli($servername, $username, $password, $db_name);
        if($connection->connect_error){
            die("Connection failed: " . $connection->connect_error);
        }
        $q = "SELECT * FROM accounts";
        $res = $connection->query($q);
        print_r($res);
        for($i = 0; $i < $res->num_rows; $i++){
            $row = $res->fetch_assoc();
            print_r($row["name"] . "\n");
            if($row["name"] == $name){
                die("Username already reserved, pcik another!");
            }
        }
        //$connection->close();
        //$connection = new mysqli($servername, $username, $password, $db_name);
        $p = "INSERT INTO accounts (name, password) VALUES (" . "'" . $name . "'" . ", " . "'" . $pass . "'" . ")";
        print_r($p);
        $connection->query($p);
        $connection->close();
    }
    
    $user = $_POST["username"];
    $pass = $_POST["password"];

    /*
    $accs = create_associative_array();
    foreach($accs as $key => $value){
        if($key == $user){
            echo(245); return;
        }
    }*/
    make_entry_2($user, $pass);
    //echo(0);
    session_start();
    $_SESSION["username"] = $user;
    //header("Location: chat_page.html");
?>