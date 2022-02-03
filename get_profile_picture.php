<?php

function print_real_string($s){
    for($i = 0; $i < strlen($s); $i++){
        print_r(ord($s[$i]) . " ");
    }
    print_r("\n");
}

$user = trim(file_get_contents("php://input"));
$file_name = $user . "_picture";
$allowed_types = array("jpg", "jpeg", "png");
$file_name_w_extension = "";
//print_real_string($user);

for($i = 0; $i < count($allowed_types); $i++){
    $s = $file_name . "." . $allowed_types[$i];
    //print_real_string($s);

    if(file_exists("./uploads/" . $s) == true){
        $file_name_w_extension = $s; break;
    }
}

if($file_name_w_extension == null){
    print_r("null\n");
}
echo("./uploads/" . $file_name_w_extension);
?>