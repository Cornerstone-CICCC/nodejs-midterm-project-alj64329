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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class TransactionModel {
    constructor() {
        this.transactions = [];
    }
    //get all transaction for specific userId
    getAllByUserId(userId) {
        const filtered = this.transactions.filter(t => t.userId === userId);
        // const sorted = filtered.sort((a,b)=>b.date.getTime() -a.date.getTime())
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
            return true;
        });
    }
    // update transaction
    updateTransaction(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const foundIndex = this.transactions.findIndex(t => t.id === id);
            if (foundIndex === -1)
                return null;
            const updatedTransaction = Object.assign(Object.assign({}, this.transactions[foundIndex]), { name: (_a = updates.name) !== null && _a !== void 0 ? _a : this.transactions[foundIndex].name, category: (_b = updates.category) !== null && _b !== void 0 ? _b : this.transactions[foundIndex].category, amount: (_c = updates.amount) !== null && _c !== void 0 ? _c : this.transactions[foundIndex].amount, date: (_d = updates.date) !== null && _d !== void 0 ? _d : this.transactions[foundIndex].date });
            this.transactions[foundIndex] = updatedTransaction;
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
        return true;
    }
}
exports.default = new TransactionModel;
