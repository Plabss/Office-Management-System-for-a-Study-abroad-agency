const express = require('express');
const { addEmployeeController,getAllEmployeesController,assignApplicantController } = require('../../controller/employee.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary upload destination

const router = express.Router();

router.post('/add-employee', upload.fields([{ name: 'cv' }, { name: 'nid' }]), addEmployeeController);
router.get('/get-all-employees', getAllEmployeesController);
router.post('/assign-applicant/:courseId/:studentId', assignApplicantController);

module.exports = router;
