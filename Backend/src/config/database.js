const mongoose = require("mongoose");

async function connectToDB() {
    // 1. Validate that the environment variable exists
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ Error: MONGO_URI is not defined in the environment variables.");
        process.exit(1); // Exit the process with a failure code
    }

    try {
        // 2. Attempt connection
        const connectionInstance = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected! Host: ${connectionInstance.connection.host}`);

        // 3. Optional but highly recommended: Listen for lifecycle events
        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected! Check your network/database status.");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

    } catch (err) {
        console.error("❌ MongoDB connection FAILED:\n", err.message);
        process.exit(1); // Exit the application if the initial connection fails
    }
}

module.exports = connectToDB;