const express = require('express');
const { loginController } = require('../../controller/auth.controller');

const router = express.Router();

router.post('/login', loginController);

module.exports = router;
