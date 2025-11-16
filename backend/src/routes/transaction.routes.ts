import { Router } from 'express'

import { checkLogin, checkLogout } from '../middleware/auth.middleware'
import transactionController from '../controllers/transaction.controller'


const transactionRouter = Router()

transactionRouter.get('/search',transactionController.searchByKeyword)
transactionRouter.get('/recent',transactionController.getRecentTransaction)
transactionRouter.get('/',transactionController.getTransactionsByUserId)
transactionRouter.get('/:id', transactionController.getTransactionById)
transactionRouter.post('/', transactionController.addTransaction)
transactionRouter.put('/:id', transactionController.updateTransactionById)
transactionRouter.delete('/:id', transactionController.deleteTransactionById)


export default transactionRouter