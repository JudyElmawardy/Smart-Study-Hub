// PROTECT.JS - Add to ALL protected pages
$(document).ready(function() {
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // NOT LOGGED IN - Redirect to login
        alert('Please log in to access this page');
        window.location.href = 'login.html';
        return;
    }
    
    // User IS logged in - Show welcome message
    const userData = JSON.parse(currentUser);
    
    // Create welcome message
    const welcomeHTML = `
        <div class="user-section">
            <div class="welcome-message">
                👋 Welcome back, <strong>${userData.name}</strong>!
            </div>
            <button class="logout-btn" id="logout-button">Logout</button>
        </div>
    `;
    
    // Add to header
    $('header').append(welcomeHTML);
    
    // Logout button click
    $('#logout-button').click(function() {
        console.log('Logout clicked');
        
        // Call PHP to destroy session
        $.ajax({
            url: 'logout.php',
            type: 'POST',
            success: function(response) {
                console.log('Logout response:', response);
            },
            error: function() {
                console.log('Logout PHP failed, but continuing...');
            },
            complete: function() {
                // Always clear localStorage and redirect
                localStorage.removeItem('currentUser');
                alert('Logged out successfully!');
                window.location.href = 'login.html';
            }
        });
    });
});