const express = require('express');
const { addVisitorController,addEmployeeToVisitor, getAllVisitorsController,getAllVisitorsWithoutPaginationController,getAVisitorController, convertVisitorToStudent, removeEmployeeFromVisitor, addDiscussionController, deleteDiscussionController } = require('../../controller/visitor.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-visitor',upload.fields([{ name: 'nidOrBirthCertificate' }]), addVisitorController);
router.get('/get-all-visitors', getAllVisitorsController);
router.get('/get-all-visitors-without-pagination', getAllVisitorsWithoutPaginationController);
router.get('/get-a-visitor/:visitorId', getAVisitorController);
router.post('/convert-to-student/:visitorId', convertVisitorToStudent);


router.post('/settings/add-employee/:visitorId', addEmployeeToVisitor);
router.post('/settings/remove-employee/:visitorId', removeEmployeeFromVisitor);


router.post('/add-discussion/:visitorId', addDiscussionController);
router.delete('/delete-discussion/:visitorId/:discussionId', deleteDiscussionController);

module.exports = router;
