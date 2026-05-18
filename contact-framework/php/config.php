<?php
/**
 * Static PHP Contact Framework - Configuration
 */

// --- Email Settings ---
define('RECIPIENT_EMAIL', 'dxel.net@gmail.com');
define('SENDER_EMAIL', 'no-reply@dxel.net');
define('EMAIL_SUBJECT', 'New Contact Form Submission');

// --- Security & CORS ---
// List of allowed domains (Origins) that can send requests to this script.
// Include 'http://localhost:4000' (Jekyll default) for testing.
// DO NOT use '*' in production.
$ALLOWED_ORIGINS = [
    'https://dxel.net',
    'https://dxelnetwork.github.io',
    'http://localhost:4000',
    'http://127.0.0.1:4000'
];

// --- Rate Limiting ---
define('ENABLE_RATE_LIMIT', true);
define('RATE_LIMIT_SECONDS', 60); // 1 minute between submissions

// --- Success Redirect (Optional) ---
// If you want to redirect to a page after success (for non-AJAX forms)
define('SUCCESS_REDIRECT', ''); 

// --- Debug Mode ---
define('DEBUG_MODE', false);
