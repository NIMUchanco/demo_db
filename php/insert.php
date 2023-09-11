<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    require_once "_includes/db_connect.php";
    $results = [];


    function selectId($link) {
        //get selected id
        $id = $_POST["id"];
        $results = [];

        //prepare statement passing in the link to the database and the query
        $query = "SELECT * FROM account_book WHERE id = ?";

        if ($stmt = mysqli_prepare($link, $query)) {
            //bind parameters
            mysqli_stmt_bind_param($stmt, "i", $id);
            
            //execute the statement
            mysqli_stmt_execute($stmt);
            
            //get the result
            $result = mysqli_stmt_get_result($stmt);

            //fetch the result as an associative array
            $row = mysqli_fetch_assoc($result);

            return $row;
            
        } else {
            throw new Exception("No ID found");
        }
    }

    function updateData($link) {
        $results = [];

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

        if ($stmt) {
            //bind parameters
            mysqli_stmt_bind_param($stmt, "ssdsi", $date, $item, $price, $type, $id);
            //execute the statement
            mysqli_stmt_execute($stmt);

            //if no updated rows, throw an exception
            if (mysqli_stmt_affected_rows($stmt) === 0) {
                throw new Exception("No rows updated");
            }

            //add updated rows to the results array
            $results[] = [
                "updateData() affected rows" => mysqli_stmt_affected_rows($stmt)
            ];

            return mysqli_stmt_affected_rows($stmt);
        }
    }

    function insertData($link) {
        $results = [];
        $insertedRows = 0;

        //Time zone
        date_default_timezone_set('America/Montreal');
        $currentDateTime = date("Y-m-d H:i:s");

        //query to insert the record
        $query = "INSERT INTO account_book (date, item, price, type, input_time) VALUES (?, ?, ?, ?, ?)";
        $date = $_POST["date"];
        $item = $_POST["item"];
        $price = $_POST["price"];
        $type = $_POST["type"];

        if(!isset($date) || !isset($item) || !isset($price) || !isset($type)) {
            throw new Exception("One or more required fields are missing.");
        }

        if($stmt = mysqli_prepare($link, $query)) {
            //bind parameters
            mysqli_stmt_bind_param($stmt, "ssdss", $date, $item, $price, $type, $currentDateTime);

            //execute the statement
            mysqli_stmt_execute($stmt);

            //get the number of inserted rows
            $insertedRows = mysqli_stmt_affected_rows($stmt);

            if ($insertedRows > 0) {
                $results[] = [
                    "date" => $date,
                    "item" => $item,
                    "price" => $price,
                    "type" => $type,
                    "input_time" => $currentDateTime
                ];
            } else {
                throw new Exception("No rows inserted");
            }

            //close the statement
            mysqli_stmt_close($stmt);

            return $results;
        }
    }

    try {
        
        if(selectId($link)) {
            $results = updateData($link);
        } else {
            $results = insertData($link);
        }

    } catch (Exception $error) {
        echo "error occurs: " . $error->getMessage();
        
    } finally {
        echo json_encode($results);
    }


?>