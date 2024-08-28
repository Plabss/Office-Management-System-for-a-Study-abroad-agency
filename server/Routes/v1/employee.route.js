const express = require('express');
const { addEmployeeController,getAllEmployeesController,getAEmployeeController,assignApplicantController,assignVisaAdminController } = require('../../controller/employee.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary upload destination

const router = express.Router();

router.post('/add-employee', upload.fields([{ name: 'cv' }, { name: 'nid' }]), addEmployeeController);
router.get('/get-all-employees', getAllEmployeesController);
router.get('/get-a-employee/:id', getAEmployeeController);
router.post('/assign-applicant/:courseId/:studentId', assignApplicantController);
router.post('/assign-visa-admin/:studentId/:visaId', assignVisaAdminController);

module.exports = router;
