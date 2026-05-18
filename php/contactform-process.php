<?php
/**
 * DXEL Network — Contact Form Processor
 * Security: Input sanitization, email validation, honeypot check, header injection prevention
 */

// Set JSON content type for AJAX responses
header('Content-Type: text/plain; charset=utf-8');

// Rate limiting (simple session-based)
session_start();
$rateLimitKey = 'contact_form_last';
$rateLimitSeconds = 30;

if (isset($_SESSION[$rateLimitKey]) && (time() - $_SESSION[$rateLimitKey]) < $rateLimitSeconds) {
    echo "Please wait a moment before submitting again.";
    exit;
}

// Honeypot check — if filled, it's a bot
if (!empty($_POST["website_url"])) {
    echo "success"; // Fake success to confuse bots
    exit;
}

// Sanitization helper
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Prevent email header injection
function isClean($str) {
    return !preg_match('/[\r\n]/', $str);
}

$errorMSG = "";

// Validate Name
if (empty($_POST["name"])) {
    $errorMSG .= "Name is required. ";
} else {
    $name = sanitize($_POST["name"]);
    if (!isClean($name)) {
        $errorMSG .= "Invalid name. ";
    }
}

// Validate Email
if (empty($_POST["email"])) {
    $errorMSG .= "Email is required. ";
} else {
    $email = sanitize($_POST["email"]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !isClean($email)) {
        $errorMSG .= "Invalid email address. ";
    }
}

// Validate Message
if (empty($_POST["message"])) {
    $errorMSG .= "Message is required. ";
} else {
    $message = sanitize($_POST["message"]);
}

// Optional fields
$phone = isset($_POST["phone"]) ? sanitize($_POST["phone"]) : "Not provided";
$service = isset($_POST["service"]) ? sanitize($_POST["service"]) : "Not specified";

// Terms
if (empty($_POST["terms"])) {
    $errorMSG .= "You must agree to the terms. ";
}

// Process
if ($errorMSG == "") {
    $EmailTo = "dxel.net@gmail.com";
    $Subject = "New Contact Form Submission — DXEL Network";

    // Build email body
    $Body = "";
    $Body .= "=================================\n";
    $Body .= "New Contact Form Submission\n";
    $Body .= "=================================\n\n";
    $Body .= "Name: " . $name . "\n";
    $Body .= "Email: " . $email . "\n";
    $Body .= "Phone: " . $phone . "\n";
    $Body .= "Service: " . $service . "\n";
    $Body .= "Message:\n" . $message . "\n\n";
    $Body .= "=================================\n";
    $Body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
    $Body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

    // Proper headers to prevent injection
    $headers = "From: noreply@dxel.net\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $success = mail($EmailTo, $Subject, $Body, $headers, "-f noreply@dxel.net");

    if ($success) {
        $_SESSION[$rateLimitKey] = time();
        echo "success";
    } else {
        echo "Something went wrong. Please try again later.";
    }
} else {
    echo $errorMSG;
}
?>