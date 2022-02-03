
<?php
    session_start();
    $s = file_get_contents("php://input");
    trim($s);
    if(isset($_SESSION[$s]) == false){
        echo(-1); return;
    }
    echo($_SESSION[$s]);
?>
