<?php
header('Content-Type: application/json');
session_start();
require_once 'config.php';

// Get JSON data from request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $data) {
    
    $email = trim($data['email']);
    $password = $data['password'];
    
    // Validation
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }
    
    // Find user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        // Login successful
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful!',
            'user' => [
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>