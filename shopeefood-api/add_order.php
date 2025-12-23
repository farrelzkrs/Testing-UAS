<?php
require 'helpers.php';

$user = authenticate($pdo); // Return user array or exits

$input = json_decode(file_get_contents('php://input'), true);
$items = $input['items'] ?? [];

if (!is_array($items) || count($items) === 0) {
    jsonResponse(["success" => false, "message" => "No items"], 400);
}

$total = 0;

// Hitung total harga valid
foreach ($items as $it) {
    $pid = intval($it['food_id']);
    $qty = intval($it['qty']);
    $stmt = $pdo->prepare("SELECT price FROM foods WHERE id = ?");
    $stmt->execute([$pid]);
    $p = $stmt->fetch();

    if (!$p) jsonResponse(["success" => false, "message" => "Food not found"], 400);
    $total += $p['price'] * $qty;
}

// Mulai Transaksi
$pdo->beginTransaction();

try {
    // 1. Insert Orders
    $ins = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
    $ins->execute([$user['id'], $total]);
    $orderId = $pdo->lastInsertId();

    // 2. Insert Items
    $insItem = $pdo->prepare("INSERT INTO order_items (order_id, food_id, qty, price) VALUES (?, ?, ?, ?)");

    foreach ($items as $it) {
        $pid = intval($it['food_id']);
        $qty = intval($it['qty']);
        $pstmt = $pdo->prepare("SELECT price FROM foods WHERE id = ?");
        $pstmt->execute([$pid]);
        $pp = $pstmt->fetch();
        $insItem->execute([$orderId, $pid, $qty, $pp['price']]);
    }

    $pdo->commit();
    jsonResponse(["success" => true, "message" => "Order placed", "order_id" => $orderId]);
} catch (Exception $e) {
    $pdo->rollBack();
    jsonResponse(["success" => false, "message" => "Order failed: " . $e->getMessage()], 500);
}
