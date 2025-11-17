function startSessionPolling(url) {
    console.log("Polling started for URL:", url);
    setInterval(() => {
        fetch(url)
            .then(res => console.log("Session check:", res.status))
            .catch(err => console.error("Polling error:", err));
    }, 5000);
}

function checkAuthSession(token) {
    console.log("Checking session with token:", token);
}

// Expose globally
globalThis.startSessionPolling = startSessionPolling;
globalThis.checkAuthSession = checkAuthSession;