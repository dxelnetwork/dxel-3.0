<?php
/**
 * Static PHP Contact Framework - Processor
 */

require_once 'config.php';
require_once 'utils.php';

// Handle CORS
handle_cors($ALLOWED_ORIGINS);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, 'Method not allowed', 405);
}

// 1. Rate Limiting
if (ENABLE_RATE_LIMIT) {
    session_start();
    $last_submit = isset($_SESSION['last_submit']) ? $_SESSION['last_submit'] : 0;
    if (time() - $last_submit < RATE_LIMIT_SECONDS) {
        send_response(false, 'Too many requests. Please wait a minute.');
    }
}

// 2. Honeypot check (anti-spam)
// This field should be hidden from humans via CSS
if (!empty($_POST['website_url'])) {
    // Treat as success to the bot, but do nothing
    send_response(true, 'Message sent successfully');
}

// 3. Data Extraction & Sanitization
$name    = isset($_POST['name'])    ? sanitize($_POST['name'])    : '';
$email   = isset($_POST['email'])   ? sanitize($_POST['email'])   : '';
$phone   = isset($_POST['phone'])   ? sanitize($_POST['phone'])   : 'Not provided';
$subject_form = isset($_POST['subject']) ? sanitize($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';

// 4. Validation
if (empty($name) || empty($email) || empty($message)) {
    send_response(false, 'Please fill in all required fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_clean($email)) {
    send_response(false, 'Invalid email address.');
}

if (!is_clean($name)) {
    send_response(false, 'Invalid name format.');
}

// 5. Build Email
$to = RECIPIENT_EMAIL;
$subject = EMAIL_SUBJECT . ($subject_form ? ": $subject_form" : "");

$email_body = "=================================\n";
$email_body .= "NEW CONTACT SUBMISSION\n";
$email_body .= "=================================\n\n";
$email_body .= "Name:    $name\n";
$email_body .= "Email:   $email\n";
$email_body .= "Phone:   $phone\n";
if ($subject_form) $email_body .= "Subject: $subject_form\n";
$email_body .= "\nMessage:\n$message\n\n";
$email_body .= "=================================\n";
$email_body .= "Date: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "IP:   " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? 'Direct') . "\n";

// Headers
$headers = "From: " . SENDER_EMAIL . "\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 6. Send Email
$success = mail($to, $subject, $email_body, $headers, "-f " . SENDER_EMAIL);

if ($success) {
    if (ENABLE_RATE_LIMIT) {
        $_SESSION['last_submit'] = time();
    }
    
    send_response(true, 'Message sent successfully! We will get back to you soon.');
} else {
    send_response(false, 'Failed to send email. Please try again later.');
}
