import { Request, Response } from 'express'
import transactionModel from '../models/transaction.model'
import { Transaction } from '../types/transaction'


/**
 * Display all Transaction by id
 * 
 * @route GET /transactions/user/:id
 * @param {Request<{id: string}>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const getTransactionsByUserId = async (req: Request<{userId:string}>, res: Response) => {
  const { userId } = req.params
  if (!userId.trim()) {
    res.status(500).send("Missing user id!")
    return
  }
  const transactions = transactionModel.getAllByUserId(userId)
  if (!transactions) {
    res.status(404).json({
        message:"There is not transaction record"})
    return
  }
  res.status(200).json(transactions)
}

/**
 * Add transaction
 * 
 * @route POST /transaction
 * @param {Request<{}, {}, Omit<Transaction, 'id'>>} req
 * @param {Response} res
 * @returns {void} Returns created transaction.
 */
const addTransaction = async(req: Request<{}, {}, Omit<Transaction, 'id'>>, res: Response) => {
  const { userId, type, name, category, amount, date } = req.body

  if (!type.trim() || !name.trim()|| !category.trim()||!amount|| !date) {
    res.status(500).json({
        message:"Missing detail!"})
    return
  }

  const transaction = await transactionModel.createTransaction({ userId, type, name, category, amount, date })
  if (!transaction) {
    res.status(500).json({
        message:"Dupulicate transaction exists"})
    return
  }
  res.status(201).json(transaction)
}

/**
 * Get transaction by transaction id
 * 
 * @route GET /transaction/:id
 * @param {Request<{id:string}>} req
 * @param {Response} res
 * @returns {void} Returns user data.
 */
const getTransactionById = (req: Request<{id:string}>, res: Response) => {
    const {id} = req.params
    if(!id.trim()){
        res.status(500).json({
            message:"Missing transaction id"
        })
        return
    }
    const transaction = transactionModel.getTransaction(id)
    if(!transaction){
        res.status(404).json({
            message:"Transaction not found"
        })
        return
    }

    res.status(200).json(transaction)
}

/**
 * Update transaction by id
 * 
 * @route PUT /transaction/:id
 * @param {Request<{id: string}, {}, Partial<Transaction>>} req
 * @param {Response} res
 * @returns {void} Returns updated user if successful.
 */
const updateTransactionById = async(req: Request<{id: string}, {}, Partial<Transaction>>, res: Response) => {
  const { id } = req.params
  if (!id.trim()) {
    res.status(500).send("Missing transaction id!")
    return
  }
  const {name, category, amount, date} = req.body
  const transaction = await transactionModel.updateTransaction(id, {name, category, amount, date})
  if (!transaction) {
    res.status(404).json({
        message:"Transaction does not exist!"})
    return
  }
  res.status(201).json(transaction)
}

/**
 * Delete transaction by id
 * 
 * @route DELETE /transaction/:id
 * @param {Request<{id: string}>} req
 * @param {Response} res
 * @returns {void} Returns true if success, else false.
 */
const deleteTransactionById = (req: Request<{id: string}>, res: Response) => {
  const { id } = req.params
  if (!id.trim()) {
    res.status(500).send("Missing id!")
    return
  }
  const result = transactionModel.deleteTransaction(id)
  if (!result) {
    res.status(404).json({
        message:"Transaction does not exist!"})
    return
  }
  res.status(200).json({
    message:"Transaction deleted!"})
}

export default {
  getTransactionsByUserId,
  addTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById
}