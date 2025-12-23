<?php
require 'helpers.php';

// Ambil input JSON
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (!$email || !$password) {
    jsonResponse(["success" => false, "message" => "Email & password wajib"], 400);
}

// Cek email duplikat
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(["success" => false, "message" => "Email sudah terdaftar"], 400);
}

// Hash password dan buat token
$hash = password_hash($password, PASSWORD_DEFAULT);
$token = bin2hex(random_bytes(16));

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, token) VALUES (?, ?, ?, ?)");
$ok = $stmt->execute([$name, $email, $hash, $token]);

if ($ok) {
    jsonResponse(["success" => true, "message" => "Registrasi berhasil"]);
} else {
    jsonResponse(["success" => false, "message" => "Gagal registrasi"], 500);
}
