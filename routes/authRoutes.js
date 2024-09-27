const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, register, login, profile, logout } = require('../controllers/authController')

//middleware
// router.use(
//     cors({
//         origin: 'http://localhost:5173',
//         credentials: true,
//         // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         // headers: ['Content-Type', 'Authorization']
//     })
// )

// API routes
router.get('/', test)
router.post('/register', register)
router.post('/login', login)
router.get('/profile', profile)
router.post('/logout', logout)
module.exports = router