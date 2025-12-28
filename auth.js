// LOGIN
    $('#login-form-submit').submit(function(e) {
        e.preventDefault();
        
        const email = $('#login-email').val().trim();
        const password = $('#login-password').val();
        
        // Validation
        if (!email || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        // Send to PHP
        $.ajax({
            url: 'login.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                console.log('Login response:', response);
                
                if (response.success) {
                    // Save user to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    
                    alert('Welcome back, ' + response.user.name + '!');
                    window.location.href = 'index.html';
                } else {
                    alert(response.message);
                }
            },
            error: function(xhr) {
                console.error('Login error:', xhr);
                alert('Error logging in. Please try again.');
            }
        });
    });