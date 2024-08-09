const express = require("express");
const multer = require('multer');
const { addEmployeeController } = require("../../controller/superAdmin.controller");

const router = express.Router();

router.route("/add-employee").post(addEmployeeController);

module.exports = router;
