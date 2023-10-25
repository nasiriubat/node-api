const express = require('express');
const postController = require('../controllers/postController');
const { authenticate, checkUserRole } = require('../middlewares/authMiddleware');


const router = express.Router()

module.exports = router;

//Get all Method
router.get('/', postController.getAll)

//Post Method
router.post('/store', authenticate, checkUserRole('admin'), postController.store)

//Get by ID Method
router.get('/show/:id', postController.show)

//Update by ID Method
router.patch('/update/:id', authenticate, checkUserRole('admin'), postController.update)

//Delete by ID Method
router.delete('/delete/:id', authenticate, checkUserRole('admin'), postController.delete)