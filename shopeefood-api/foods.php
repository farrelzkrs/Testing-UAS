<?php
require 'helpers.php';

$stmt = $pdo->query("SELECT f.id, f.name, f.description, f.price, f.image, r.name AS restaurant 
                     FROM foods f 
                     LEFT JOIN restaurants r ON f.restaurant_id = r.id 
                     ORDER BY f.id DESC");
$data = $stmt->fetchAll();

echo json_encode($data);
