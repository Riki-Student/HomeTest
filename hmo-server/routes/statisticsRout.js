const express = require('express')
const router = express.Router()
console.log("router");
const statisticsController = require('../controllers/statisticsController')
router.route('/')
.get(statisticsController.getPastMonthSickCount)
module.exports = router