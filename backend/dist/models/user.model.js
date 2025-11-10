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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserModel {
    constructor() {
        this.users = [];
    }
    // Create user
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = newUser;
            const foundIndex = this.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
            if (foundIndex !== -1)
                return false;
            const hashedPassword = yield bcrypt_1.default.hash(password, 12);
            this.users.push({
                id: (0, uuid_1.v4)(),
                username,
                password: hashedPassword
            });
            return true;
        });
    }
    // Check user
    loginUser(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = details;
            const found = this.users.find(u => u.username === username);
            if (!found)
                return false;
            const isMatch = yield bcrypt_1.default.compare(password, found.password);
            if (!isMatch)
                return false;
            return found;
        });
    }
    // Get user data
    getUser(username) {
        const user = this.users.find(u => u.username === username);
        if (!user)
            return false;
        return user;
    }
}
exports.default = new UserModel;
