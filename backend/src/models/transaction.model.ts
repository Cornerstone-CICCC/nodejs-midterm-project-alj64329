
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { Transaction } from '../types/transaction'

class TransactionModel {
  private transactions:Transaction[]=[]

  //get all transaction for specific userId
  getAllByUserId(userId:string){
    const filtered = this.transactions.filter(t=>t.userId === userId)
    const sorted = filtered.sort((a,b)=>b.date.getTime() -a.date.getTime())
    return sorted
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
    return true
  }

  // update transaction
  async updateTransaction(id:string, updates:Partial<Transaction>) {
    const foundIndex = this.transactions.findIndex(t => t.id === id)

    if(foundIndex === -1) return null

    const updatedTransaction :Transaction={
        ...this.transactions[foundIndex],
        name: updates.name ?? this.transactions[foundIndex].name,
        category: updates.category ?? this.transactions[foundIndex].category,
        amount: updates.amount ?? this.transactions[foundIndex].amount,
        date: updates.date ?? this.transactions[foundIndex].date,
    }

    this.transactions[foundIndex]=updatedTransaction

    return updatedTransaction
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

    return true
  }
}

export default new TransactionModel