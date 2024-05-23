const express = require('express')
const { signUp, deleteAccount, editPassword, forgotPassword} = require('../Controllers/Usercontroller')
const { login } = require('../Controllers/Usercontroller')
const { validateUser, validateSchema, validateLoginSchema } = require('../Middleware/validator')
const verifyToken = require('../Middleware/verifyToken')
const userRouter = express.Router()

userRouter.post('/signUp', validateUser(validateSchema),   signUp)
userRouter.post('/login', validateUser(validateLoginSchema) , login)
userRouter.post('/delete', verifyToken , deleteAccount)
userRouter.post('/edit', verifyToken, editPassword)
userRouter.post('/forgotPassword', verifyToken, forgotPassword)




module.exports = userRouter