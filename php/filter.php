<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    //error_reporting(E_ALL);

    //connect to database
    require_once "_includes/db_connect.php";
    $selectedMonth = $_GET["month"];
    $selectedYear = $_GET["year"];

    //prepare SQL query
    if (isset($_GET["type"])) {
        $query = "SELECT * FROM `account_book` WHERE MONTH(date) = ? AND YEAR(date) = ? AND type = ? ORDER BY date ASC, input_time";
    } else {
        $query = "SELECT * FROM `account_book` WHERE MONTH(date) = ? AND YEAR(date) = ? ORDER BY date ASC, input_time";
    }

    //prepare SQL statement
    $stmt = mysqli_prepare($link, $query);

    //bind parameters
    if (isset($_GET["type"])) {
        $selectedType = $_GET["type"];
        mysqli_stmt_bind_param($stmt, "iis", $selectedMonth, $selectedYear, $selectedType);
    } else {
        mysqli_stmt_bind_param($stmt, "ii", $selectedMonth, $selectedYear);
    }

    //execute the statement
    mysqli_stmt_execute($stmt);

    //get the result
    $result = mysqli_stmt_get_result($stmt);

    //initialize an array to store the fetched data
    $data = array();
    
    //fetch the result as an associative array and add it to the data array
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

      // Set the Content-Type header to indicate JSON response
      header('Content-Type: application/json');
    
    //encode and send the results as JSON
    echo json_encode($data);
    
    //close the connection
    mysqli_close($link);

?>