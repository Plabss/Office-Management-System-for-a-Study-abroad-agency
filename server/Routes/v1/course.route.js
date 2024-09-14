const express = require('express');
const { addCourseController,getACourseController,uploadADocumentController, deleteDocument, updateCourseDetailsController } = require('../../controller/course.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-course', addCourseController);
router.get('/get-a-course/:courseId', getACourseController);
router.post('/upload-document/:courseId',upload.single('file'), uploadADocumentController);
router.delete('/delete-document/:courseId', deleteDocument);
router.put('/update-course/:courseId', updateCourseDetailsController);

module.exports = router;
