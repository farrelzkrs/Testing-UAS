<?php
require 'helpers.php';

// Cek token admin
$user = authenticate($pdo);
if ($user['role'] !== 'admin') {
    jsonResponse(["success" => false, "message" => "Unauthorized: Admin only"], 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = intval($_POST['price'] ?? 0);
    $restaurant_id = intval($_POST['restaurant_id'] ?? 0);

    $image_name = null;

    // Upload Gambar
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmp = $_FILES['image']['tmp_name'];
        $orig = basename($_FILES['image']['name']);
        $ext = pathinfo($orig, PATHINFO_EXTENSION);
        $image_name = uniqid('img_') . '.' . $ext;
        $dest = __DIR__ . "/images/" . $image_name;

        if (!move_uploaded_file($tmp, $dest)) {
            jsonResponse(["success" => false, "message" => "Upload failed"], 500);
        }
    }

    $stmt = $pdo->prepare("INSERT INTO foods (restaurant_id, name, description, price, image) VALUES (?, ?, ?, ?, ?)");
    $ok = $stmt->execute([$restaurant_id ?: null, $name, $description, $price, $image_name]);

    if ($ok) jsonResponse(["success" => true, "message" => "Food added"]);
    else jsonResponse(["success" => false, "message" => "DB error"], 500);
} else {
    jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}
