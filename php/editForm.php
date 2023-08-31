<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    //connect to database
    require_once "_includes/db_connect.php";

    //get selected id
    $id = $_GET["id"];

    //prepare statement passing in the link to the database and the query
    $stmt = mysqli_prepare($link, "SELECT * FROM account_book WHERE id = ?");

    //bind parameters
    mysqli_stmt_bind_param($stmt, "i", $id);

    //execute the statement
    mysqli_stmt_execute($stmt);

    //get the result
    $result = mysqli_stmt_get_result($stmt);

    $results = [];

    //loop through the result
    while ($row = mysqli_fetch_assoc($result)) {
        $results[] = $row;
    }

    //encode & display the results
    echo json_encode($results);

    //close the connection
    mysqli_close($link);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account Book - Maiko Matsuoka</title>
</head>
<body>
    <section>
        <h1>EDIT My Account Book</h1>
        
        <form id="form" action="./update.php" method="post">
            <input type="hidden" name="id" value="<?= $id; ?>">
            <label for="date">Date:</label>
            <input type="date" id="date" name="date" value="<?= $results[0]['date']; ?>"><br>
        
            <label for="item">Item:</label>
            <input type="text" id="item" name="item" value="<?= $results[0]['item']; ?>"><br>
        
            <label for="price">Price:</label>
            <input type="number" id="price" name="price" step="0.01" value="<?= $results[0]['price']; ?>"><br>
        
            <label for="type">Type:</label>
            <input type="radio" id="type" name="type" value="expenditure" 
                <?php if($results[0]['type'] == 'expenditure') echo 'checked'; ?>
            >&nbsp; Expenditure &nbsp;
            <input type="radio" id="type" name="type" value="income"
                <?php if($results[0]['type'] == 'income') echo 'checked'; ?>
            >&nbsp; Income &nbsp;
            <br>
        
            <input id="submit" type="submit" value="Enter">
        </form>
    </section>

    <section id="display"></section>
</body>
</html>