<?php
/**
 * DXEL Network — Call Me Form Processor
 * Security: Input sanitization, email validation, honeypot check, header injection prevention
 */

header('Content-Type: text/plain; charset=utf-8');

session_start();
$rateLimitKey = 'callme_form_last';
$rateLimitSeconds = 30;

if (isset($_SESSION[$rateLimitKey]) && (time() - $_SESSION[$rateLimitKey]) < $rateLimitSeconds) {
    echo "Please wait a moment before submitting again.";
    exit;
}

// Honeypot check
if (!empty($_POST["website_url"])) {
    echo "success";
    exit;
}

function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function isClean($str) {
    return !preg_match('/[\r\n]/', $str);
}

$errorMSG = "";

if (empty($_POST["name"])) {
    $errorMSG .= "Name is required. ";
} else {
    $name = sanitize($_POST["name"]);
    if (!isClean($name)) $errorMSG .= "Invalid name. ";
}

if (empty($_POST["phone"])) {
    $errorMSG .= "Phone is required. ";
} else {
    $phone = sanitize($_POST["phone"]);
}

if (empty($_POST["email"])) {
    $errorMSG .= "Email is required. ";
} else {
    $email = sanitize($_POST["email"]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !isClean($email)) {
        $errorMSG .= "Invalid email address. ";
    }
}

if (empty($_POST["select"])) {
    $errorMSG .= "Please select a service. ";
} else {
    $select = sanitize($_POST["select"]);
}

if (empty($_POST["terms"])) {
    $errorMSG .= "You must agree to the terms. ";
}

if ($errorMSG == "") {
    $EmailTo = "dxel.net@gmail.com";
    $Subject = "New Callback Request — DXEL Network";

    $Body = "";
    $Body .= "=================================\n";
    $Body .= "New Callback Request\n";
    $Body .= "=================================\n\n";
    $Body .= "Name: " . $name . "\n";
    $Body .= "Phone: " . $phone . "\n";
    $Body .= "Email: " . $email . "\n";
    $Body .= "Service: " . $select . "\n\n";
    $Body .= "=================================\n";
    $Body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
    $Body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

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