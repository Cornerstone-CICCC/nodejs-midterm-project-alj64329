import { v4 as uuidv4 } from 'uuid'
import { Transaction } from '../types/transaction'
import fs from 'fs'
import path from 'path'

class TransactionModel {
  private filePath = path.join(__dirname, "../../data/transactions.json")
  private transactions:Transaction[]=[]

  constructor() {
    this.load();
  }

  private save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.transactions, null, 2));
  }

  private load() {
    if (fs.existsSync(this.filePath)) {
      this.transactions = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }
  }

  //get all transaction for specific userId
  getAllByUserId(userId:string){
    const filtered = this.transactions.filter(t=>t.userId === userId)
    return filtered
  }

  // Create transaction
  async createTransaction(newTransaction: Omit<Transaction, 'id'>) {
    const {userId, type, name, category, amount,date } = newTransaction

    const dupicateFound = this.transactions.findIndex(t=> t.name === name && t.amount ===amount && t.date === date && t.type ===type)

    if(dupicateFound!==-1){
        return false
    }
    this.transactions.push({
      id: uuidv4(),
      type,
      userId,
      name,
      category,
      amount,
      date
    })
    this.save()
    return true
  }

  // update transaction
  async updateTransaction(id:string, updates:Partial<Transaction>) {
    const foundIndex = this.transactions.findIndex(t => t.id === id)

    if(foundIndex === -1) return null

    const updatedTransaction :Transaction={
        ...this.transactions[foundIndex],
        type: updates.type ?? this.transactions[foundIndex].type,
        name: updates.name ?? this.transactions[foundIndex].name,
        category: updates.category ?? this.transactions[foundIndex].category,
        amount: updates.amount ?? this.transactions[foundIndex].amount,
        date: updates.date ?? this.transactions[foundIndex].date,
    }

    this.transactions[foundIndex]=updatedTransaction
    this.save()

    return updatedTransaction
  }

  getThisMonthTransaction(yearMounth:string, userId:string){
    
    const filtered = this.transactions.filter(t => t.date.includes(yearMounth)&&t.userId===userId)

    if(!filtered) return false

    return filtered
  }

  // Get transaction data
  getTransaction(expenseId: string) {
    const transaction = this.transactions.find(t => t.id === expenseId)
    if (!transaction) return false
    return transaction
  }

  //Delete transaction
  deleteTransaction(transactionId:string){
    const foundIndex = this.transactions.findIndex(t=>t.id===transactionId)
    if(foundIndex === -1) return false

    this.transactions.splice(foundIndex,1)
    this.save()

    return true
  }

  //search
  searchTransaction(keyword:string){
    const foundTransactions = this.transactions.filter(t=>t.name.toLowerCase().includes(keyword.toLowerCase())||
      t.category?.toLowerCase().includes(keyword.toLowerCase()))

    if(foundTransactions.length === 0){
      return "there is no matching"
    }
    return foundTransactions
  }
}

export default new TransactionModel