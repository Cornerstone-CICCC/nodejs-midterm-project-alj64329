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
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class TransactionModel {
    constructor() {
        this.filePath = path_1.default.join(__dirname, "../../data/transactions.json");
        this.transactions = [];
        this.load();
    }
    save() {
        fs_1.default.writeFileSync(this.filePath, JSON.stringify(this.transactions, null, 2));
    }
    load() {
        if (fs_1.default.existsSync(this.filePath)) {
            this.transactions = JSON.parse(fs_1.default.readFileSync(this.filePath, "utf-8"));
        }
    }
    //get all transaction for specific userId
    getAllByUserId(userId) {
        const filtered = this.transactions.filter(t => t.userId === userId);
        return filtered;
    }
    // Create transaction
    createTransaction(newTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, type, name, category, amount, date } = newTransaction;
            const dupicateFound = this.transactions.findIndex(t => t.name === name && t.amount === amount && t.date === date && t.type === type);
            if (dupicateFound !== -1) {
                return false;
            }
            this.transactions.push({
                id: (0, uuid_1.v4)(),
                type,
                userId,
                name,
                category,
                amount,
                date
            });
            this.save();
            return true;
        });
    }
    // update transaction
    updateTransaction(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const foundIndex = this.transactions.findIndex(t => t.id === id);
            if (foundIndex === -1)
                return null;
            const updatedTransaction = Object.assign(Object.assign({}, this.transactions[foundIndex]), { type: (_a = updates.type) !== null && _a !== void 0 ? _a : this.transactions[foundIndex].type, name: (_b = updates.name) !== null && _b !== void 0 ? _b : this.transactions[foundIndex].name, category: (_c = updates.category) !== null && _c !== void 0 ? _c : this.transactions[foundIndex].category, amount: (_d = updates.amount) !== null && _d !== void 0 ? _d : this.transactions[foundIndex].amount, date: (_e = updates.date) !== null && _e !== void 0 ? _e : this.transactions[foundIndex].date });
            this.transactions[foundIndex] = updatedTransaction;
            this.save();
            return updatedTransaction;
        });
    }
    // Get transaction data
    getTransaction(expenseId) {
        const transaction = this.transactions.find(t => t.id === expenseId);
        if (!transaction)
            return false;
        return transaction;
    }
    //Delete transaction
    deleteTransaction(transactionId) {
        const foundIndex = this.transactions.findIndex(t => t.id === transactionId);
        if (foundIndex === -1)
            return false;
        this.transactions.splice(foundIndex, 1);
        this.save();
        return true;
    }
    //search
    searchTransaction(keyword) {
        const foundTransactions = this.transactions.filter(t => {
            var _a;
            return t.name.toLowerCase().includes(keyword.toLowerCase()) ||
                ((_a = t.category) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(keyword.toLowerCase()));
        });
        if (foundTransactions.length === 0) {
            return "there is no matching";
        }
        return foundTransactions;
    }
}
exports.default = new TransactionModel;
