const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');


//registration
router.post('/register', authController.register)

//login
router.post('/login', authController.login)

//logout
router.post('/logout', authenticate, authController.logout)

//refresh token
router.post('/refresh-token', authController.refreshToken);



module.exports = router;