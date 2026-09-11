const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added to the blacklist"],
        unique: true, // Prevents duplicate entries if a user double-clicks logout
        trim: true
    }
}, {
    timestamps: true
});

// ⚡ PERFORMANCE & COST SAVER: TTL Index
// This automatically deletes the document 24 hours (86400 seconds) after it is created.
// IMPORTANT: Change '86400' to match the exact expiration time of your JWTs!
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Stick to the singular, capitalized naming convention
const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);

module.exports = BlacklistToken;