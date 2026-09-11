const { Router } = require("express");
const { 
    registerUserController, 
    loginUserController, 
    logoutUserController, 
    getMeController 
} = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/login", loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Clear token from user cookie and add the token to blacklist
 * @access Public
 */
authRouter.post("/logout", logoutUserController); // 🚀 Changed to POST for REST compliance

/**
 * @route GET /api/auth/me
 * @description Get the current logged in user details
 * @access Private
 */
authRouter.get("/me", authUser, getMeController); // 🚀 Changed from /get-me to /me

module.exports = authRouter;