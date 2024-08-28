const express = require('express');
const { addStudentController,getAllStudentsController,getAllStudentsByEmployeeIdController,getAStudentController, uploadDocument } = require('../../controller/student.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-student', addStudentController);
router.get('/get-all-students/:employeeID', getAllStudentsByEmployeeIdController);
router.get('/get-all-students', getAllStudentsController);
router.get('/get-a-student/:studentID', getAStudentController);
router.post('/upload-document/:studentId', upload.single('file'), uploadDocument);

module.exports = router;
