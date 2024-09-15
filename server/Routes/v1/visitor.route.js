const express = require('express');
const { addVisitorController, getAllVisitorsController,getAllVisitorsWithoutPaginationController,getAVisitorController, convertVisitorToStudent } = require('../../controller/visitor.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-visitor',upload.fields([{ name: 'nidOrBirthCertificate' }]), addVisitorController);
router.get('/get-all-visitors', getAllVisitorsController);
router.get('/get-all-visitors-without-pagination', getAllVisitorsWithoutPaginationController);
router.get('/get-a-visitor/:visitorId', getAVisitorController);
router.post('/convert-to-student/:visitorId', convertVisitorToStudent);

module.exports = router;
