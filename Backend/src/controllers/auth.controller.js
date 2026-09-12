const User = require("../models/user.model"); 
const BlacklistToken = require("../models/blacklist.model"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CROSS-ORIGIN COOKIE FIX: Updated sameSite and secure rules for Vercel/Render integration
const cookieOptions = {
    httpOnly: true, // Prevents XSS attacks (JavaScript cannot access the cookie)
    secure: true, // REQUIRED when sameSite is "none"
    sameSite: "none", // REQUIRED for cross-domain cookies (Vercel to Render)
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
};

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email and password" });
        }

        const isUserAlreadyExists = await User.findOne({ $or: [{ username }, { email }] });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: "Account already exists with this email address or username" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hash });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        // CRITICAL: We must explicitly request the password since it is hidden by default in the model
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" }); 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            message: "User logged in successfully.",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            await BlacklistToken.create({ token });
        }

        res.clearCookie("token", cookieOptions);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during logout", error: error.message });
    }
}

async function getMeController(req, res) {
    try {
        // req.user is presumably set by your auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching user details", error: error.message });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};