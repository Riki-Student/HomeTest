const express = require('express')
const router = express.Router()
console.log("router");
const unvaccinatedController = require('../controllers/unvaccinatedController')
router.route('/')
.get(unvaccinatedController.getUnvaccinatedCount)
module.exports = router