setInterval(() => {
  fetch('/api/panic/status')
    .then(response => response.json())
    .then(data => {
      if (data.panic) {
        alert("🚨 Panic button pressed by m-001!");
        // Optional: stop further alerts after first popup
        clearInterval(window.panicPoller);
      }
    })
    .catch(err => console.error("Polling error:", err));
}, 2000);

// Store interval ID in case you want to stop it later
window.panicPoller = setInterval(() => {}, 0);
