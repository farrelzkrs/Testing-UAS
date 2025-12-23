<?php
// Include db agar variabel $pdo tersedia saat helper dipanggil
require_once 'db.php';

header("Content-Type: application/json");

// Helper untuk mengirim response JSON
function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Helper untuk validasi token (Authentication)
function authenticate($pdo)
{
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!$authHeader && function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
    }

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $stmt = $pdo->prepare("SELECT id, role FROM users WHERE token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        if ($user) {
            return $user;
        }
    }

    jsonResponse(["success" => false, "message" => "Unauthorized / Invalid Token"], 401);
}
