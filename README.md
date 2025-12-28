# Smart Study Hub

A web-based student productivity platform that helps students study more effectively.

## Features

- 🔐 Secure user authentication (signup/login)
- ⏰ Pomodoro timer with focus and break modes
- 💡 Daily motivational quotes from API
- ✅ Task management (todo list)
- 📱 Responsive design (mobile & desktop)

## Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- jQuery 3.7.1

**Backend:**
- PHP 8.x
- MySQL 8.x
- AJAX/JSON

**Server:**
- Apache (XAMPP)

## Installation

1. Install XAMPP
2. Clone this repository to `C:\xampp\htdocs\`
3. Create database `smart_study_hub` in phpMyAdmin
4. Import the SQL table:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
5. Open `http://localhost/smart-study-hub/login.html`

## Security Features

- Password hashing (bcrypt)
- SQL injection prevention (PDO prepared statements)
- Client & server-side validation
- Session management

## Team

- Judy Kamal (320240043) - Frontend Developer, UI/UX Designer
- Jana Amr (320240028) - Frontend Developer, UI/UX Designer

## License

Educational project for university coursework.
