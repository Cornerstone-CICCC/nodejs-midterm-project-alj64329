import { Request, Response } from 'express'
import transactionModel from '../models/transaction.model'
import { Transaction } from '../types/transaction'


/**
 * Display all Transaction by id
 * 
 * @route GET /transactions
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const getTransactionsByUserId = async (req: Request, res: Response) => {
  const  userId  = req.session?.userId
  console.log("Session at /transactions:", req.session);
  if (!userId||!userId.trim()) {
    res.status(500).json({
      message:"Missing user id!"
  })
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
 * @param {Request<{}, {}, Omit<Transaction, 'id'|'userId'>>} req
 * @param {Response} res
 * @returns {void} Returns created transaction.
 */
const addTransaction = async(req: Request<{}, {}, Omit<Transaction, 'id'|'userId'>>, res: Response) => {
  const  userId  = req.session?.userId
  const { type, name, category, amount, date } = req.body

  if (!type.trim() || !name.trim()|| !amount|| !date||!userId) {
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
 * Get this month transactions
 * 
 * @route GET /transaction/recent
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns transaction data.
 */
const getRecentTransaction = (req: Request, res: Response) => {
    const  userId  = req.session?.userId
    console.log("Session at /transactions:", req.session);
    if (!userId||!userId.trim()) {
      res.status(500).json({
        message:"Missing user id!"
    })
      return
    }
    const today = new Date()
    const year = today.getFullYear().toString()
    const month = today.getMonth()+1<10? `0${today.getMonth()+1}`:`${today.getMonth()+1}`
    const yearMounth = `${year}-${month}`

    const transaction = transactionModel.getThisMonthTransaction(yearMounth, userId)
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
    res.status(500).json({
      message:"Missing transaction id!"})
    return
  }
  const {type, name, category, amount, date} = req.body
  const transaction = await transactionModel.updateTransaction(id, {type, name, category, amount, date})
  if (!transaction) {
    res.status(404).json([])
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
    res.status(500).json({
      message:"Missing id!"})
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

/**
* Search employees by firstname.
* 
* @route GET /transactions/search?name=somevalue
* @query {string} name - name to search for.
* @param {Request<{}, {}, {}, { name: string }>} req - Express request containing query parameters.
* @param {Response} res - Express response object.
* @returns {void} Responds with an array of matched user objects or an error message.
*/
const searchByKeyword = (req: Request<{}, {}, {}, { name: string }>, res: Response) => {
  const { name } = req.query
  const transactions = transactionModel.searchTransaction(name)

  if(!transactions){
    res.status(404).json({
      message: "Unfortunately no matching"
    })
    return
  }
  res.status(200).json(transactions)
}

export default {
  getTransactionsByUserId,
  addTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  searchByKeyword,
  getRecentTransaction
}