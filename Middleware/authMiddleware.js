const jwt = require('jsonwebtoken');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header not provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        // Set both req.userId and req.user.id for compatibility
        req.userId = decoded.userId;
        req.user = { id: decoded.userId };
        
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;