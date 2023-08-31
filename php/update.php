<?php

    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    //connect to database
    require_once "_includes/db_connect.php";

    //query to replace the record
    $query = "UPDATE account_book SET date = ?, item = ?, price = ?, type = ? WHERE id = ?";
    //prepare statement passing in the link to the database and the query
    $stmt = mysqli_prepare($link, $query);

    //get selected id and other values
    $id= $_POST["id"];
    $date = $_POST["date"];
    $item = $_POST["item"];
    $price = $_POST["price"];
    $type = $_POST["type"];

    //bind parameters
    mysqli_stmt_bind_param($stmt, "ssdsi", $date, $item, $price, $type, $id);

    //execute the statement
    mysqli_stmt_execute($stmt);

    //close the statement
    mysqli_stmt_close($stmt);

    //back to index.html
    header("Location: ../index.html");
    exit();

?>