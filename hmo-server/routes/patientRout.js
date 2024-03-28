const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patientController')
router.route('/')
.get(patientController.getAllPatients)
.post(patientController.createNewPatient)
.delete(patientController.deletePatient)
router.get('/:id', patientController.getPatientById)
router.put('/:id',patientController.updatePatient)
module.exports = router