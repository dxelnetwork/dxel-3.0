/**
 * Static PHP Contact Framework - Frontend Handler
 * Version: 1.0.0
 */

(function () {
    'use strict';

    const ContactFramework = {
        init: function () {
            const forms = document.querySelectorAll('[data-dxel-form]');
            forms.forEach(form => {
                form.addEventListener('submit', this.handleSubmit.bind(this));
            });
        },

        handleSubmit: async function (e) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
            const action = form.getAttribute('action');

            if (!action) {
                this.showNotification('Form action is missing!', 'error');
                return;
            }

            // Client-side validation check
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Set loading state
            this.setLoading(submitBtn, true);

            try {
                const formData = new FormData(form);
                const response = await fetch(action, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors'
                });

                const result = await response.json();

                if (result.success) {
                    this.showNotification(result.message, 'success');
                    form.reset();
                } else {
                    this.showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Contact Framework Error:', error);
                this.showNotification('Network error. Please try again later.', 'error');
            } finally {
                this.setLoading(submitBtn, false, originalBtnText);
            }
        },

        setLoading: function (btn, isLoading, originalText = '') {
            if (!btn) return;
            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('dxel-loading');
                btn.innerHTML = '<span class="dxel-spinner"></span> Sending...';
            } else {
                btn.disabled = false;
                btn.classList.remove('dxel-loading');
                btn.innerHTML = originalText;
            }
        },

        showNotification: function (message, type = 'success') {
            // Check for existing container or create one
            let container = document.querySelector('.dxel-notification-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'dxel-notification-container';
                document.body.appendChild(container);
            }

            const notification = document.createElement('div');
            notification.className = `dxel-notification dxel-${type}`;
            notification.innerHTML = `
                <div class="dxel-notification-content">${message}</div>
                <button class="dxel-notification-close">&times;</button>
            `;

            container.appendChild(notification);

            // Auto-remove after 5 seconds
            const timeout = setTimeout(() => {
                this.removeNotification(notification);
            }, 5000);

            // Manual close
            notification.querySelector('.dxel-notification-close').addEventListener('click', () => {
                clearTimeout(timeout);
                this.removeNotification(notification);
            });

            // Trigger animation
            requestAnimationFrame(() => {
                notification.classList.add('dxel-show');
            });
        },

        removeNotification: function (el) {
            el.classList.remove('dxel-show');
            setTimeout(() => el.remove(), 400);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ContactFramework.init());
    } else {
        ContactFramework.init();
    }

    // Export to window for manual use if needed
    window.DXEL_Contact = ContactFramework;

})();
