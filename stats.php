<?php
require_once 'db.php';

$conn = getDbConnection();

// Fetch statistics from the database
// Implement the logic to get the required statistics

$stats = [
    'total_meetings' => 0,
    'meetings_per_day' => [],
    'total_users' => 0,
    'users_per_day' => [],
    'objectives' => []
];

// Populate $stats with actual data from the database

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Management Tool - Statistics</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Meeting Management Tool - Statistics</h1>
    </header>

    <main>
        <h2>Statistics</h2>
        <ul>
            <li>Total meetings created: <?php echo $stats['total_meetings']; ?></li>
            <li>Total users registered: <?php echo $stats['total_users']; ?></li>
        </ul>

        <h3>Meetings created per day</h3>
        <ul>
            <?php foreach ($stats['meetings_per_day'] as $date => $count): ?>
                <li><?php echo $date; ?>: <?php echo $count; ?></li>
            <?php endforeach; ?>
        </ul>

        <h3>Users registered per day</h3>
        <ul>
            <?php foreach ($stats['users_per_day'] as $date => $count): ?>
                <li><?php echo $date; ?>: <?php echo $count; ?></li>
            <?php endforeach; ?>
        </ul>

        <h3>Meeting Objectives</h3>
        <ul>
            <?php foreach ($stats['objectives'] as $objective => $count): ?>
                <li><?php echo $objective; ?>: <?php echo $count; ?></li>
            <?php endforeach; ?>
        </ul>
    </main>
</body>
</html>