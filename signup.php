<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Log the request
file_put_contents('debug.log', "Signup attempt at " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

// Include database connection
require_once 'config.php';

// Get POST data
$rawInput = file_get_contents('php://input');
file_put_contents('debug.log', "Raw input: " . $rawInput . "\n", FILE_APPEND);

$data = json_decode($rawInput, true);

// Check if data was received
if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No data received or invalid JSON'
    ]);
    exit;
}

// Validate input (Server-side validation)
if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required!'
    ]);
    exit;
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format!'
    ]);
    exit;
}

// Validate password length
if (strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 6 characters!'
    ]);
    exit;
}

try {
    // Check if PDO connection exists
    if (!isset($pdo)) {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed'
        ]);
        exit;
    }
    
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'An account with this email already exists!'
        ]);
        exit;
    }
    
    // Hash password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $result = $stmt->execute([$name, $email, $hashedPassword]);
    
    file_put_contents('debug.log', "Insert result: " . ($result ? 'success' : 'failed') . "\n", FILE_APPEND);
    
    // Start session and store user info
    session_start();
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully!',
        'user' => [
            'name' => $name,
            'email' => $email
        ]
    ]);
    
} catch(PDOException $e) {
    file_put_contents('debug.log', "Database error: " . $e->getMessage() . "\n", FILE_APPEND);
    
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>