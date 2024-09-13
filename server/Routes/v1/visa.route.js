const express = require('express');
const { addVisaController, getAVisaController, uploadADocumentController, deleteVisaDocument } = require('../../controller/visa.controller');
// getAVisaController,
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/add-visa', addVisaController);
router.get('/get-a-visa/:visaId', getAVisaController);
router.post('/upload-document/:visaId',upload.single('file'), uploadADocumentController);
router.delete('/delete-document/:visaId', deleteVisaDocument);

module.exports = router;
