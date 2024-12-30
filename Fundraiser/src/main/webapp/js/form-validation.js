// Form Validation for Signup and Login
function validateSignupForm(event) {
    // Get form values
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    // Validate username (non-empty and alphanumeric)
    if (username.trim() === "") {
        alert("Username is required");
        event.preventDefault();  // Prevent form submission
        return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        alert("Username must be alphanumeric");
        event.preventDefault();
        return false;
    }

    // Validate email format
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        event.preventDefault();
        return false;
    }

    // Validate password (at least 6 characters)
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        event.preventDefault();
        return false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        event.preventDefault();
        return false;
    }

    return true;
}

function validateLoginForm(event) {
    // Get form values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Validate username and password (non-empty)
    if (username.trim() === "") {
        alert("Username is required");
        event.preventDefault();
        return false;
    }

    if (password.trim() === "") {
        alert("Password is required");
        event.preventDefault();
        return false;
    }

    return true;
}
