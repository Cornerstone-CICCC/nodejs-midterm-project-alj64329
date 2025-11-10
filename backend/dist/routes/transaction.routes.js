"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const transactionRouter = (0, express_1.Router)();
transactionRouter.get('/user/:id', transaction_controller_1.default.getTransactionsByUserId);
transactionRouter.get('/:id', transaction_controller_1.default.getTransactionById);
transactionRouter.post('/', transaction_controller_1.default.addTransaction);
transactionRouter.put('/:id', transaction_controller_1.default.updateTransactionById);
transactionRouter.delete('/:id', transaction_controller_1.default.deleteTransactionById);
exports.default = transactionRouter;
