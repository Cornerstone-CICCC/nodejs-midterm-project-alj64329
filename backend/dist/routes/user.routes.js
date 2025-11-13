"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controllers_1 = __importDefault(require("../controllers/user.controllers"));
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', auth_middleware_1.checkLogout, user_controllers_1.default.signup);
userRouter.post('/login', auth_middleware_1.checkLogout, user_controllers_1.default.login);
userRouter.get('/account', auth_middleware_1.checkLogin, user_controllers_1.default.getAccount);
userRouter.get('/check-auth', user_controllers_1.default.checkAuth);
userRouter.get('/logout', auth_middleware_1.checkLogin, user_controllers_1.default.logout);
exports.default = userRouter;
