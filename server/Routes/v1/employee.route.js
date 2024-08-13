const express = require('express');
const { addEmployeeController,getAllEmployeesController } = require('../../controller/employee.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary upload destination

const router = express.Router();

router.post('/add-employee', upload.fields([{ name: 'cv' }, { name: 'nid' }]), addEmployeeController);
router.get('/get-all-employees', getAllEmployeesController);

module.exports = router;
