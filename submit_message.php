
<?php
    session_start();
    $user = $_SESSION["username"];
    $msg = file_get_contents("php://input");

    $file = fopen("chat.txt", 'a+');
    fwrite($file, "\n" . $user . "|" . $msg);
    fclose($file);
    
    echo("\n" . $user . "|" . $msg);

?>