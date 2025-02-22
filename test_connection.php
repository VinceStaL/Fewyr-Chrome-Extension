<?php
require_once 'db.php';

$conn = getDbConnection();
if ($conn) {
    echo "Connected successfully to the database.";
    $conn->close();
} else {
    echo "Failed to connect to the database.";
}