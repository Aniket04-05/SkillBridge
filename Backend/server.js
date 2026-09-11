require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

// 1. SCALABILITY: Use dynamic port from environment
const PORT = process.env.PORT || 3000;

// 2. STABILITY: Wait for database to connect BEFORE starting the server
connectToDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });

        // 3. CLEAN UP: Graceful shutdown handling
        const gracefulShutdown = () => {
            console.log("Shutting down server gracefully...");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        };

        // Listen for termination signals (e.g., from Docker, Vercel, or manual Ctrl+C)
        process.on("SIGINT", gracefulShutdown);
        process.on("SIGTERM", gracefulShutdown);
    })
    .catch((err) => {
        console.error("❌ Failed to connect to the database. Server not started.", err);
        process.exit(1);
    });