const cloudinary = require('../config/cloudinary');
const { addEmployee,getAllEmployees } = require('../services/employee.services');

exports.addEmployeeController = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;


    // Upload files to Cloudinary
    const cvUpload = await cloudinary.uploader.upload(req.files['cv'][0].path, {
      folder: 'employees/cv',
    });
    const nidUpload = await cloudinary.uploader.upload(req.files['nid'][0].path, {
      folder: 'employees/nid',
    });

    const newEmployee = await addEmployee({
      name,
      email,
      password,
      phone,
      role,
      cv: cvUpload.secure_url,
      nid: nidUpload.secure_url,
    });

    res.status(200).json({
      status: 'success',
      message: 'Employee Registration completed successfully',
      data: newEmployee,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllEmployeesController = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
