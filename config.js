const API_URL = "https://gooey-finer-retaining.ngrok-free.dev";

fetch(API_URL, {
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
})