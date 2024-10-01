const express = require('express');
const { addEmployeeController,disableEmployeeController,updateRoleController,getAllEmployeesController,getAEmployeeController,assignApplicantController,assignVisaAdminController, getAllEmployeesWithoutPaginationController } = require('../../controller/employee.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary upload destination

const router = express.Router();

router.post('/add-employee', upload.fields([{ name: 'cv' }, { name: 'nid' }, {name: 'img'}]), addEmployeeController);
router.get('/get-all-employees', getAllEmployeesController);
router.get('/get-all-employees-without-pagination', getAllEmployeesWithoutPaginationController);
router.get('/get-a-employee/:id', getAEmployeeController);
router.post('/assign-applicant/:courseId/:studentId', assignApplicantController);
router.post('/assign-visa-admin/:studentId/:visaId', assignVisaAdminController);
router.put('/update-role/:id', updateRoleController);
router.put('/disable-employee/:employeeId', disableEmployeeController);

module.exports = router;
