const express = require('express');
const { addStudentController,getAllStudentsController,deleteDiscussionController,addDiscussionController,getAllStudentsByEmployeeIdController,getAStudentController, uploadDocument } = require('../../controller/student.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-student', addStudentController);
router.get('/get-all-students/:employeeID', getAllStudentsByEmployeeIdController);
router.get('/get-all-students', getAllStudentsController);
router.get('/get-a-student/:studentID', getAStudentController);
router.post('/upload-document/:studentId', upload.single('file'), uploadDocument);
router.post('/add-discussion/:studentId', addDiscussionController);
router.delete('/delete-discussion/:studentId/:discussionId', deleteDiscussionController);

module.exports = router;
