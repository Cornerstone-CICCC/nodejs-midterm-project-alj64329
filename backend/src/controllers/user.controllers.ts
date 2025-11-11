import { Request, Response } from 'express'
import userModel from '../models/user.model'
import { User } from '../types/user'

/**
 * Sign up (add user)
 * 
 * @route POST /users/signup
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const signup = async (req: Request<{}, {}, Omit<User,'id'>>, res: Response) => {
  const { username, password } = req.body
  if (!username.trim() || !password.trim()) {
    res.status(500).json({
      message: "Missing username or password!"
    })
    return
  }
  const isSuccess: boolean = await userModel.createUser({ username, password })
  if (!isSuccess) {
    res.status(409).json({
      message: "Username is taken!"
    })
    return
  }
  res.status(201).json({
    message: "User successfully added!"
  })
}

/**
 * Check-auth
 * 
 * @route GET /users/check-auth
 * @param {Request} req
 * @param {Response} res
 * @returns {void} 
 */
const  checkAuth = (req:Request, res:Response)=>{
  if (!req.session || !req.session.username) {
    res.status(401).json({
      loggedIn:false
    })
    return
  }
  res.status(200).json({
    loggedIn:true
  })
}
/**
 * Log in (check user)
 * 
 * @route POST /users/login
 * @param {Request<{}, {}, Omit<User,'id'>>} req
 * @param {Response} res
 * @returns {void} Returns success and cookie.
 */
const login = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
  const { username, password } = req.body
  if (!username.trim() || !password.trim()) {
    res.status(500).json({
      message: "Username or password is empty!"
    })
    return
  }
  const user = await userModel.loginUser({ username, password })
  if (!user) {
    res.status(500).json({
      message: "Incorrect username or password!"
    })
    return
  }
  if (req.session) {
    req.session.isLoggedIn = true
    req.session.username = user.username
    req.session.userId = user.id
  }
  res.status(200).json({
    message: "Login successful!"
  })
}

/**
 * Get user acount
 * 
 * @route GET /users/account
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns user data.
 */
const getAccount = (req: Request, res: Response) => {
  if (!req.session || !req.session.username) {
    res.status(401).json({
      message: "Only logged-in users can access this page!"
    })
    return
  }
  const { username } = req.session
  const user = userModel.getUser(username)
  if (!user) {
    res.status(404).json({
      message: "User does not exist!"
    })
    return
  }
  res.status(200).json({
    username: user.username,
    userId:user.id
  })
}

/**
 * Log out
 * 
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Clear session cookie.
 */
const logout = (req: Request, res: Response) => {
  if (req.session) {
    req.session = null // clear the session cookie
  }
  res.status(200).json({
    message: "Logout successful!"
  })
}

export default {
  signup,
  login,
  getAccount,
  logout,
  checkAuth
}