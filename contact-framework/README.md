# Static PHP Contact Framework

A lightweight, standalone framework for handling contact form submissions on static sites (Jekyll, GitHub Pages, etc.) using a central PHP backend.

## Features
- ✅ **CORS Support**: Securely handle requests from your static domains.
- ✅ **Anti-Spam**: Built-in Honeypot and Rate Limiting.
- ✅ **AJAX Driven**: Smooth submission without page refreshes.
- ✅ **Zero Dependencies**: Pure Vanilla JS and PHP.
- ✅ **Ready for SSL**: Works perfectly on HTTPS environments.

---

## 1. Backend Setup (PHP)

1. Upload the `php/` folder to a server that supports PHP (e.g., `api.yourdomain.com`).
2. Edit `php/config.php`:
   - Set `RECIPIENT_EMAIL` to your email.
   - Set `SENDER_EMAIL` (must be an email from your hosting domain).
   - Add your static site's URL to the `$ALLOWED_ORIGINS` array.

## 2. Frontend Integration

### A. Include CSS & JS
Add these to your site's `<head>` or before `</body>`:

```html
<link rel="stylesheet" href="path/to/contact.css">
<script src="path/to/contact.js"></script>
```

### B. Create the Form
Your form needs the `data-dxel-form` attribute and must point to your `process.php` URL.

```html
<form data-dxel-form action="https://your-api-domain.com/php/process.php" method="POST">
    <!-- Honeypot (Spam protection) -->
    <div class="dxel-hp">
        <label>Website</label>
        <input type="text" name="website_url" tabindex="-1" autocomplete="off">
    </div>

    <div class="form-group">
        <input type="text" name="name" placeholder="Name" required>
    </div>
    
    <div class="form-group">
        <input type="email" name="email" placeholder="Email" required>
    </div>

    <div class="form-group">
        <textarea name="message" placeholder="Message" required></textarea>
    </div>

    <button type="submit">Send Message</button>
</form>
```

---

## 3. Configuration Details (`config.php`)

| Constant | Description |
| --- | --- |
| `RECIPIENT_EMAIL` | Where submissions are sent. |
| `SENDER_EMAIL` | The "From" address (use `no-reply@yourdomain.com`). |
| `$ALLOWED_ORIGINS`| List of domains allowed to send requests (CORS). |
| `RATE_LIMIT_SECONDS` | Delay between submissions from the same user. |

---

## Troubleshooting

- **CORS Error**: Ensure your static site URL is exactly matched in `$ALLOWED_ORIGINS` (including `https://`).
- **Emails not arriving**: Check if your server allows `mail()`. Some hosts require using a real email account from that domain as the `SENDER_EMAIL`.
- **Mixed Content**: If your static site is on HTTPS, your PHP backend **must** also be on HTTPS.
