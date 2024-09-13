const cloudinary = require('../config/cloudinary');
const Notification = require('../model/Notification.model');
const Student = require('../model/Student.model');
const { addEmployee,getAllEmployees,updateRole,assignApplicant,assignVisaAdmin, getEmployeeById, getAllEmployeesWithoutPagination } = require('../services/employee.services');

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
exports.getAllEmployeesWithoutPaginationController = async (req, res) => {
  try {
    const employees = await getAllEmployeesWithoutPagination();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllEmployeesController = async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query; // Default to 1st page with 2 employees per page
    const employeesData = await getAllEmployees(page, limit);
    res.status(200).json(employeesData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAEmployeeController = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getAEmployeeController = async (req, res) => {
//   const { page = 1, limit = 2 } = req.query; // Get pagination parameters from query

//   try {
//     const { employee, totalPages } = await getEmployeeById(req.params.id, { page, limit });
//     if (!employee) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     res.status(200).json({ employee, totalPages }); // Return paginated results with total pages
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.assignApplicantController = async (req, res) => {
  try {
    console.log("httttttttttttttttt")
    const { courseId,studentId } = req.params;
    const { applicantId,applicantName } = req.body;
    console.log("aaaaaaaaaaaaa",req.body) 
    const assigned = await assignApplicant(courseId,studentId,applicantId,applicantName);
    const student = await Student.findById(studentId);
    console.log("sssssssssssssss",student)
    if (assigned) {
      const notification = new Notification({
        message: `A new student has been assigned to you for application: ${student.fullName}`,
        employeeId: applicantId,
        studentId: studentId,
        for: "application",
      });
      await notification.save();

      const io = req.app.get("socketio");
      io.emit("notification", notification);
    }
    res.status(200).json(assigned);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.assignVisaAdminController = async (req, res) => {
  try {
    console.log("httttttttttttttttt")
    const { studentId,visaId } = req.params;
    const { visaAdminId,visaAdminName } = req.body;
    console.log("aaaaaaaaaaaaa",req.body) 
    const assigned = await assignVisaAdmin(studentId,visaId,visaAdminId,visaAdminName);
    const student = await Student.findById(studentId);
    if (assigned) {
      const notification = new Notification({
        message: `A new student has been assigned to you for visa application: ${student.fullName}`,
        employeeId: visaAdminId,
        studentId: studentId,
        for: "visa-application",
      });
      await notification.save();

      const io = req.app.get("socketio");
      io.emit("notification", notification);
    }
    res.status(200).json(assigned);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, action } = req.body;

    const update = await updateRole(id, role, action);
    res.status(200).json({ message: 'Role updated successfully', data: update });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
