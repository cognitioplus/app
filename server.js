const express = require('express');
const path = require('path');
const app = express();

// Set the port (defaults to 3000 if not set in environment)
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle SPA (Single Page Application) routing
// This ensures that if a user refreshes the page, they stay in the app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Cognitio+ PWA is running!`);
    console.log(`👉 Local:   http://localhost:${PORT}`);
    console.log(`=============================================`);
});
