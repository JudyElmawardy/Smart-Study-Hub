<?php
// ALWAYS set headers BEFORE starting the session or outputting anything
header('Content-Type: application/json');

// Start the session only after headers are set
session_start();

// Completely destroy the session
session_unset();
session_destroy();

// Optional: Expire the session cookie manually (extra safety)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Respond with JSON success
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully!'
]);

exit;
?>