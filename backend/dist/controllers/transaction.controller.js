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
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
/**
 * Display all Transaction by id
 *
 * @route GET /transactions
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const getTransactionsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId);
    const userId = (_b = req.session) === null || _b === void 0 ? void 0 : _b.userId;
    if (!userId.trim()) {
        res.status(500).send("Missing user id!");
        return;
    }
    const transactions = transaction_model_1.default.getAllByUserId(userId);
    if (!transactions) {
        res.status(404).json({
            message: "There is not transaction record"
        });
        return;
    }
    res.status(200).json(transactions);
});
/**
 * Add transaction
 *
 * @route POST /transaction
 * @param {Request<{}, {}, Omit<Transaction, 'id'>>} req
 * @param {Response} res
 * @returns {void} Returns created transaction.
 */
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, type, name, category, amount, date } = req.body;
    if (!type.trim() || !name.trim() || !category.trim() || !amount || !date) {
        res.status(500).json({
            message: "Missing detail!"
        });
        return;
    }
    const transaction = yield transaction_model_1.default.createTransaction({ userId, type, name, category, amount, date });
    if (!transaction) {
        res.status(500).json({
            message: "Dupulicate transaction exists"
        });
        return;
    }
    res.status(201).json(transaction);
});
/**
 * Get transaction by transaction id
 *
 * @route GET /transaction/:id
 * @param {Request<{id:string}>} req
 * @param {Response} res
 * @returns {void} Returns user data.
 */
const getTransactionById = (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
        res.status(500).json({
            message: "Missing transaction id"
        });
        return;
    }
    const transaction = transaction_model_1.default.getTransaction(id);
    if (!transaction) {
        res.status(404).json({
            message: "Transaction not found"
        });
        return;
    }
    res.status(200).json(transaction);
};
/**
 * Update transaction by id
 *
 * @route PUT /transaction/:id
 * @param {Request<{id: string}, {}, Partial<Transaction>>} req
 * @param {Response} res
 * @returns {void} Returns updated user if successful.
 */
const updateTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id.trim()) {
        res.status(500).send("Missing transaction id!");
        return;
    }
    const { name, category, amount, date } = req.body;
    const transaction = yield transaction_model_1.default.updateTransaction(id, { name, category, amount, date });
    if (!transaction) {
        res.status(404).json({
            message: "Transaction does not exist!"
        });
        return;
    }
    res.status(201).json(transaction);
});
/**
 * Delete transaction by id
 *
 * @route DELETE /transaction/:id
 * @param {Request<{id: string}>} req
 * @param {Response} res
 * @returns {void} Returns true if success, else false.
 */
const deleteTransactionById = (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
        res.status(500).send("Missing id!");
        return;
    }
    const result = transaction_model_1.default.deleteTransaction(id);
    if (!result) {
        res.status(404).json({
            message: "Transaction does not exist!"
        });
        return;
    }
    res.status(200).json({
        message: "Transaction deleted!"
    });
};
exports.default = {
    getTransactionsByUserId,
    addTransaction,
    getTransactionById,
    updateTransactionById,
    deleteTransactionById
};
