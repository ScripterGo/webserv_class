

<?php
    $db_adress = "127.0.0.1";
    $db_name = "test";
    $db_chart_name = "image_uploads";
    $db_password = "7!ac@-q5c68VC!u";
    $db_username = "Ante0417";

    function send_del_request($user){
        global $db_adress, $db_name, $db_password, $db_username;
        $q = "DELETE FROM image_uploads WHERE user=" . "'" . $user . "'";
        //print($q);
        $connection = new mysqli($db_adress, $db_username, $db_password, $db_name);
        $connection->query($q);
    }

    //INSERT INTO img_uploads (path, user, upload_time) VALUES ('./uploads/Hamrin_picture.jpg', 'Hamrin', NOW())

    function send_request($user, $path, $filename){
        $user = trim($user);
        global $db_adress, $db_name, $db_password, $db_username;
        //$q2 = "INSERT INTO imageuploads (filename, user, uploadtime) VALUES ('$filename', '" . $_SESSION["username"] . "', NOW())";
        $flag = ($user == "HOLGER") ? (true) : false;
        $q = "INSERT INTO image_uploads (path, user, upload_time, snuskig) VALUES ('$path', '" . $user . "', NOW(),'" . $flag . "')";
        //$q = "INSERT INTO image_uploads (path, user, upload_time) VALUES ('./uploads/Hamrin_picture.jpg', 'Hamrin', NOW())";
        //print_r($q2);
        //print_r($q);
        //print_r($db_username);
        $connecton = new mysqli($db_adress, $db_username, $db_password, $db_name);
        $connecton->query($q); 
    }

    session_start();
    if($_SESSION["username"] == null){
        echo("Log in first!"); return;
    }else if($_FILES["file"] == null){
        echo("You did not select any picture!"); return;
    }

    $allowed_types = array("jpg", "jpeg", "png");
    
    $user = $_SESSION["username"];
    $file = $_FILES["file"];
    $fileName = explode('.', $file["name"])[0];
    $fileType = explode('.', $file["name"])[1];
    $sz = $file["size"];
    
    $tmp_path = $file["tmp_name"];
    $new_file_name = $user . "_picture";

    $dest = "./uploads/" . $new_file_name;
    for($i = 0; $i < count($allowed_types); $i++){
        if(file_exists($dest . "." . $allowed_types[$i]) == true){
            unlink($dest . "." . $allowed_types[$i]);
            send_del_request($user);
            //print_r("Deletion successful\n");
        }
    }
    $file_path = $dest . "." . $fileType;
    move_uploaded_file($tmp_path, $file_path);
    send_request($user, $file_path, $new_file_name);
?>