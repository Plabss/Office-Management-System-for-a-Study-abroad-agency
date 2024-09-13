const express = require('express');
const { addStudentController,getAllStudentsController,updateStudentController,deleteDiscussionController,addDiscussionController,getAllStudentsByEmployeeIdController,getAStudentController, uploadDocument, updateStudentProgressController, getStudentCoursesController, deleteDocumentController, addEmployeeToStudent, removeEmployeeFromStudent, studentLogin, uploadDocumentStudent, getStudentDocuments, deleteStudentDocument } = require('../../controller/student.controller');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../../middlewares/authMiddleware');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-student', addStudentController);
router.put('/update-student-basic-info/:studentID', updateStudentController);
router.get('/get-all-students/:employeeID', getAllStudentsByEmployeeIdController);
router.get('/get-all-students', getAllStudentsController);
router.get('/get-a-student/:studentID', getAStudentController);
router.post('/upload-document/:studentId', upload.single('file'), uploadDocument);
router.delete('/delete-document/:studentId', deleteDocumentController);
router.post('/add-discussion/:studentId', addDiscussionController);
router.delete('/delete-discussion/:studentId/:discussionId', deleteDiscussionController);
router.put('/update-progress/:studentId', updateStudentProgressController);
router.get('/get-student-courses/:studentId', getStudentCoursesController);

router.post('/settings/add-employee/:studentId', addEmployeeToStudent);
router.post('/settings/remove-employee/:studentId', removeEmployeeFromStudent);


router.post('/login', studentLogin)
router.post('/upload-document-private/:studentId', verifyToken, upload.single('file'), uploadDocumentStudent);
router.get('/get-documents-private/:studentId', verifyToken, getStudentDocuments);
router.delete('/delete-document-private/:studentId', verifyToken, deleteStudentDocument);

module.exports = router;
