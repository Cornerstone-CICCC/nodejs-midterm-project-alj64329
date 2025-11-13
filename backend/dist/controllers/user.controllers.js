"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Sign up (add user)
 *
 * @route POST /users/signup
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
        res.status(500).json({
            message: "Missing username or password!"
        });
        return;
    }
    const isSuccess = yield user_model_1.default.createUser({ username, password });
    if (!isSuccess) {
        res.status(409).json({
            message: "Username is taken!"
        });
        return;
    }
    res.status(201).json({
        message: "User successfully added!"
    });
});
/**
 * Check-auth
 *
 * @route GET /users/check-auth
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const checkAuth = (req, res) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            loggedIn: false
        });
        return;
    }
    res.status(200).json({
        loggedIn: true
    });
};
/**
 * Log in (check user)
 *
 * @route POST /users/login
 * @param {Request<{}, {}, Omit<User,'id'>>} req
 * @param {Response} res
 * @returns {void} Returns success and cookie.
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
        res.status(500).json({
            message: "Username or password is empty!"
        });
        return;
    }
    const user = yield user_model_1.default.loginUser({ username, password });
    if (!user) {
        res.status(500).json({
            message: "Incorrect username or password!"
        });
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.username = user.username;
        req.session.userId = user.id;
    }
    res.status(200).json({
        message: "Login successful!"
    });
});
/**
 * Get user acount
 *
 * @route GET /users/account
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns user data.
 */
const getAccount = (req, res) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "Only logged-in users can access this page!"
        });
        return;
    }
    const { username } = req.session;
    const user = user_model_1.default.getUser(username);
    if (!user) {
        res.status(404).json({
            message: "User does not exist!"
        });
        return;
    }
    res.status(200).json({
        username: user.username,
        userId: user.id
    });
};
/**
 * Log out
 *
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Clear session cookie.
 */
const logout = (req, res) => {
    if (req.session) {
        req.session = null; // clear the session cookie
    }
    res.status(200).json({
        message: "Logout successful!"
    });
};
exports.default = {
    signup,
    login,
    getAccount,
    logout,
    checkAuth
};
