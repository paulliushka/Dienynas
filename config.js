const API_URL = "https://gooey-finer-retaining.ngrok-free.dev";

const originalFetch = window.fetch;
window.fetch = async function (resource, config = {}) {
    if (!config.headers) {
        config.headers = {};
    }
    
    if (config.headers instanceof Headers) {
        config.headers.append("ngrok-skip-browser-warning", "true");
    } else {
        config.headers["ngrok-skip-browser-warning"] = "true";
    }

    return originalFetch(resource, config);
};