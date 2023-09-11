<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    //connect to database
    require_once "_includes/db_connect.php";
    $id = $_POST["id"];

    //prepare statement passing in the link to the database and the query
    $stmt = mysqli_prepare($link, "DELETE FROM `account_book` WHERE id = ?");

    //bind parameters
    mysqli_stmt_bind_param($stmt, "i", $id);

    //execute the statement
    mysqli_stmt_execute($stmt);

    //get the result
    $result = mysqli_stmt_get_result($stmt);

    //fetch the result as an associative array
    $row = mysqli_fetch_assoc($result);

    //encode & display the results
    echo json_encode($results);

    //close the connection
    mysqli_close($link);

?>