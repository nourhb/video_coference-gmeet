/**
 * Consultation Booking Widget - Embeddable JavaScript
 * 
 * Usage:
 * <script src="http://your-domain.com/embed.js"></script>
 * <div id="consultation-booking-widget"></div>
 * 
 * Or with custom container:
 * <script>
 *   window.ConsultationBookingConfig = {
 *     containerId: 'my-custom-container',
 *     serverUrl: 'http://your-domain.com',
 *     language: 'fr', // 'en' or 'fr'
 *     theme: 'light' // 'light' or 'dark'
 *   };
 * </script>
 * <script src="http://your-domain.com/embed.js"></script>
 */

(function() {
    'use strict';

    // Default configuration
    const defaultConfig = {
        containerId: 'consultation-booking-widget',
        serverUrl: window.location.origin,
        language: 'en',
        theme: 'light',
        width: '100%',
        height: '600px'
    };

    // Merge user config with defaults
    const config = Object.assign({}, defaultConfig, window.ConsultationBookingConfig || {});

    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Create and insert the widget
    function createWidget() {
        const container = document.getElementById(config.containerId);
        
        if (!container) {
            console.error(`Consultation Booking Widget: Container with ID "${config.containerId}" not found.`);
            return;
        }

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = `${config.serverUrl}/embed?lang=${config.language}&theme=${config.theme}`;
        iframe.style.width = config.width;
        iframe.style.height = config.height;
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';
        iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        iframe.frameBorder = '0';
        iframe.allowTransparency = 'true';
        iframe.title = 'Consultation Booking Widget';

        // Add responsive behavior
        iframe.style.maxWidth = '100%';
        
        // Clear container and add iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // Handle iframe messages (for resizing, etc.)
        window.addEventListener('message', function(event) {
            if (event.origin !== config.serverUrl) return;
            
            if (event.data.type === 'resize') {
                iframe.style.height = event.data.height + 'px';
            }
            
            if (event.data.type === 'booking-success') {
                // Trigger custom event for parent page
                const customEvent = new CustomEvent('consultationBooked', {
                    detail: event.data.booking
                });
                window.dispatchEvent(customEvent);
            }
        });

        console.log('Consultation Booking Widget loaded successfully');
    }

    // Initialize widget when DOM is ready
    ready(createWidget);

    // Expose API for programmatic control
    window.ConsultationBookingWidget = {
        reload: function() {
            createWidget();
        },
        
        updateConfig: function(newConfig) {
            Object.assign(config, newConfig);
            createWidget();
        },
        
        getConfig: function() {
            return Object.assign({}, config);
        }
    };

})();

// Auto-create widget if default container exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('consultation-booking-widget')) {
        console.log('Auto-initializing Consultation Booking Widget');
    }
});