const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router()

module.exports = router;

//Get all Method
router.get('/getAll', postController.getAll)

//Post Method
router.post('/post', postController.store)

//Get by ID Method
router.get('/getOne/:id', postController.getOne)

//Update by ID Method
router.patch('/update/:id', postController.update)

//Delete by ID Method
router.delete('/delete/:id', postController.delete)