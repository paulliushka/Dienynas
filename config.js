const API_URL = "https://gooey-finer-retaining.ngrok-free.dev";

const originalFetch = window.fetch;
window.fetch = async function(resource, options = {}) {
    options.headers = options.headers || {};
    
    if (options.headers instanceof Headers) {
        options.headers.set("ngrok-skip-browser-warning", "true");
    } else {
        options.headers["ngrok-skip-browser-warning"] = "true";
    }
    
    return originalFetch(resource, options);
};