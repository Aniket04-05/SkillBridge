const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model"); // Updated to match our new standard

async function authUser(req, res, next) {
    try {
        // 1. SCALABILITY: Check cookies first, fallback to Authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // 2. Check if the token is blacklisted (logged out)
        const isTokenBlacklisted = await BlacklistToken.findOne({ token });

        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }

        // 3. Verify token payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach user to request object
        req.user = decoded;
        next();

    } catch (err) {
        // Provide clear feedback if the token simply expired vs a server crash
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired token." });
        }
        
        console.error("Auth Middleware Error:", err);
        return res.status(500).json({ message: "Internal server error during authentication." });
    }
}

module.exports = { authUser };