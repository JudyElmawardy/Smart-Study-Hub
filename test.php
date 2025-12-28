<?php
echo "Testing database connection...<br><br>";

require_once 'config.php';

if (isset($pdo)) {
    echo "✅ Database connection: <strong>SUCCESS</strong><br><br>";
    
    // Try to insert a test user
    try {
        $testName = "Test User";
        $testEmail = "test" . time() . "@example.com"; // Unique email
        $testPassword = password_hash("123456", PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $result = $stmt->execute([$testName, $testEmail, $testPassword]);
        
        if ($result) {
            echo "✅ Test user inserted successfully!<br>";
            echo "📧 Email: " . $testEmail . "<br>";
            echo "<br>Now check your database - you should see a new user!";
        } else {
            echo "❌ Failed to insert test user";
        }
        
    } catch(PDOException $e) {
        echo "❌ Database error: " . $e->getMessage();
    }
    
} else {
    echo "❌ Database connection: <strong>FAILED</strong>";
}
?>