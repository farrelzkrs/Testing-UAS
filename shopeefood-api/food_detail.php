<?php
require 'helpers.php';

$id = $_GET['id'] ?? null;
if (!$id) jsonResponse(["success" => false, "message" => "Missing id"], 400);

$stmt = $pdo->prepare("SELECT f.id, f.name, f.description, f.price, f.image, r.name AS restaurant 
                       FROM foods f 
                       LEFT JOIN restaurants r ON f.restaurant_id = r.id 
                       WHERE f.id = ?");
$stmt->execute([$id]);
$food = $stmt->fetch();

if ($food) {
    jsonResponse(["success" => true, "data" => $food]);
} else {
    jsonResponse(["success" => false, "message" => "Not found"], 404);
}
