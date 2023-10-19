<?php

    $host = "localhost:3306";
    $db = "maiko25_demo_db";
    $user = "maiko25_demo_db";
    $pass = "0q?3y4Qv7";

    $link = mysqli_connect($host, $user, $pass, $db);

    if (!$link) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        header('Content-Type: text/plain; charset=utf-8', true, 500);
        exit();
    }

?>