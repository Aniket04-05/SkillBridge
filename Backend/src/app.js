const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// 1. SECURITY: Dynamic CORS for Production
app.use(cors({
    // Uses the deployed frontend URL if available, otherwise defaults to local Vite port
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true
}));

// 2. PARSING MIDDLEWARES: Added strict payload limits to prevent DOS attacks
app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Useful if you ever process form-data
app.use(cookieParser());

// 3. ROUTE IMPORTS
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

// 4. API ROUTES
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// 5. DEPLOYMENT LIFESAVER: Health Check Endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "success", message: "Server is healthy and running!" });
});

// 6. SCALABILITY: Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Global Server Error:", err);
    
    res.status(500).json({
        message: "An unexpected server error occurred.",
        // Hide sensitive stack traces from users when in production
        error: process.env.NODE_ENV === "production" ? null : err.message 
    });
});

module.exports = app;