import { Router } from 'express'

import { checkLogin, checkLogout } from '../middleware/auth.middleware'
import userControllers from '../controllers/user.controllers'

const userRouter = Router()

userRouter.post('/signup', checkLogout, userControllers.signup)
userRouter.post('/login', checkLogout, userControllers.login)
userRouter.get('/account', checkLogin, userControllers.getAccount)
userRouter.get('/logout', checkLogin, userControllers.logout)

export default userRouter