<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    //connect to database
    require_once "_includes/db_connect.php";

    //prepare statement passing in the link to the database and the query
    $stmt = mysqli_prepare($link, "SELECT id, date, item, price, type, input_time FROM account_book ORDER BY date ASC, input_time");
    
    //execute the statement
    mysqli_stmt_execute($stmt);

    //get the result
    $result = mysqli_stmt_get_result($stmt);

    //loop through the result
    while ($row = mysqli_fetch_assoc($result)) {
        $results[] = $row;
    }

    //encode & display the results
    echo json_encode($results);

    //close the connection
    mysqli_close($link);
    
?>