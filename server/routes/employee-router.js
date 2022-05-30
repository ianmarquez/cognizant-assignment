const express = require('express')

const EmployeeController = require('../controller/employee-ctrl')

const router = express.Router()


router.post('/employee', EmployeeController.createEmployee)
router.put('/employee/:id', EmployeeController.updateEmployee)
router.delete('/employee/:id', EmployeeController.deleteEmployee)
router.get('/employee/:id', EmployeeController.getEmployeeById)
router.get('/employees', EmployeeController.getEmployees)
router.post('/employees', EmployeeController.createBatchEmployees);

module.exports = router