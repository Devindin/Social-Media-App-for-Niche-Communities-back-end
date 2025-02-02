const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Database Connection
require("./db");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Models
require("./Models/User");
require("./Models/Community");
require("./Models/Post")

// Routes
const authRoutes = require('./Routes/AuthRoutes');
app.use(authRoutes);


// Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ error: error.message });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
