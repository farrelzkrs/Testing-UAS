<?php
require 'helpers.php';

$user = authenticate($pdo);

$stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user['id']]);
$orders = $stmt->fetchAll();

// Ambil detail item untuk setiap order
foreach ($orders as &$o) {
    $stmt2 = $pdo->prepare("SELECT oi.*, f.name AS food_name 
                            FROM order_items oi 
                            LEFT JOIN foods f ON oi.food_id = f.id 
                            WHERE oi.order_id = ?");
    $stmt2->execute([$o['id']]);
    $o['items'] = $stmt2->fetchAll();
}

jsonResponse(["success" => true, "data" => $orders]);
