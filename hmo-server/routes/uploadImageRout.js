const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage:storage})
const uploadImageController = require('../controllers/uploadImageController')
router.route('/')
router.route('/:id')
.post(upload.single("file"),uploadImageController.uploadImage)

module.exports = router