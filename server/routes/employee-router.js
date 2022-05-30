const express = require('express')
const os = require('os')
const multer  = require('multer')
const upload = multer({ dest: os.tmpdir() })

const EmployeeController = require('../controller/employee-ctrl')

const router = express.Router()


router.post('/employee', EmployeeController.createEmployee)
router.put('/employee/:id', EmployeeController.updateEmployee)
router.delete('/employee/:id', EmployeeController.deleteEmployee)
router.get('/employee/:id', EmployeeController.getEmployeeById)
router.get('/employees', EmployeeController.getEmployees)
router.post('/employees', EmployeeController.createBatchEmployees);
router.post('/employees/upload', upload.single('file'), EmployeeController.createBatchEmployeesV2);

module.exports = router