const Course = require('../model/Course.model');
const Employee = require('../model/Employee.model');
const Student = require('../model/Student.model');
const Visa = require('../model/Visa.model');

exports.addEmployee = async (employeeData) => {
  employeeData.role = [employeeData.role];
  const newEmployee = new Employee(employeeData);
  return await newEmployee.save();
};
exports.getAllEmployeesWithoutPagination = async () => {
  try {
    const employees = await Employee.find(); // Fetch all employees
    return employees;
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};
exports.getAllEmployees = async (page, limit) => {
  try {
    const pageNumber = parseInt(page, 10) || 1; // Convert to integer
    const limitNumber = parseInt(limit, 10) || 2; // Convert to integer

    // Calculate skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch employees with pagination
    const employees = await Employee.find().skip(skip).limit(limitNumber);
    
    // Get the total count for pagination
    const totalEmployees = await Employee.countDocuments();

    return {
      employees,
      totalPages: Math.ceil(totalEmployees / limitNumber),
      currentPage: pageNumber,
    };
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};
exports.getEmployeeById = async (id) => {
  try {
    const employee = await Employee.findById(id).populate('students.asCounselor students.asApplicant students.asVisaAdmin');
    return employee;
  } catch (error) {
  }
};

// Backend Service: Modify getEmployeeById to support pagination
// Adjust your service to handle pagination for each type of student list

// exports.getEmployeeById = async (id, { page = 1, limit = 2 } = {}) => {
//   try {
//     // Fetch employee data with populated students for each role
//     const employee = await Employee.findById(id)
//       .populate({
//         path: 'students.asCounselor',
//         options: { skip: (page - 1) * limit, limit: limit }, // Pagination for counselor students
//       })
//       .populate({
//         path: 'students.asApplicant',
//         options: { skip: (page - 1) * limit, limit: limit }, // Pagination for applicant students
//       })
//       .populate({
//         path: 'students.asVisaAdmin',
//         options: { skip: (page - 1) * limit, limit: limit }, // Pagination for visa admin students
//       });

//     // Count total students for each role (if needed to return total pages)
//     const totalCounselor = await Employee.countDocuments({ _id: id, 'students.asCounselor': { $exists: true } });
//     const totalApplicant = await Employee.countDocuments({ _id: id, 'students.asApplicant': { $exists: true } });
//     const totalVisaAdmin = await Employee.countDocuments({ _id: id, 'students.asVisaAdmin': { $exists: true } });

//     return {
//       employee,
//       totalPages: {
//         counseling: Math.ceil(totalCounselor / limit),
//         applicant: Math.ceil(totalApplicant / limit),
//         visaAdmin: Math.ceil(totalVisaAdmin / limit),
//       },
//     };
//   } catch (error) {
//     throw new Error('Error fetching employee by ID: ' + error.message);
//   }
// };




exports.assignApplicant = async (courseId, studentId, applicantId, applicantName) => {
  try {
    // Update the course with the assigned applicant details
    const course = await Course.findByIdAndUpdate(courseId, {
      ['applicant.name']: applicantName,
      ['applicant._id']: applicantId,
    });

    // Update the student by adding the applicant to the "employees.asApplicant" field
    // and set the progress to "application processing"
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: { "employees.asApplicant": applicantId },
        progress: "application processing"  // Update the progress field
      },
      { new: true } // Return the updated student document
    );

    // Update the employee by adding the student to the "students.asApplicant" field
    const employee = await Employee.findByIdAndUpdate(
      applicantId,
      { $addToSet: { "students.asApplicant": studentId } },
      { new: true } // Return the updated employee document
    );

    return { course: course, student: student, employee: employee };
  } catch (error) {
    throw new Error('Error assigning applicant: ' + error.message);
  }
};

exports.assignVisaAdmin = async (studentId, visaId, visaAdminId, visaAdminName) => {
  try {
    // Update the visa with the assigned visa admin details
    const visa = await Visa.findByIdAndUpdate(visaId, {
      ['visaAdmin.name']: visaAdminName,
      ['visaAdmin._id']: visaAdminId,
    });

    // Update the student by adding the visa admin to the "employees.asVisaAdmin" field
    // and set the progress to "visa processing"
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: { "employees.asVisaAdmin": visaAdminId },
        progress: "visa processing"  // Update the progress field
      },
      { new: true } // Return the updated student document
    );

    // Update the employee by adding the student to the "students.asVisaAdmin" field
    const employee = await Employee.findByIdAndUpdate(
      visaAdminId,
      { $addToSet: { "students.asVisaAdmin": studentId } },
      { new: true } // Return the updated employee document
    );

    return { visa: visa, student: student, employee: employee };
  } catch (error) {
    throw new Error('Error assigning visa admin: ' + error.message);
  }
};

exports.updateRole = async (employeeId, role, action) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (action === 'add') {
      // Add the role if it does not exist already
      if (!employee.role.includes(role)) {
        employee.role.push(role);
      } else {
        throw new Error('Role already exists');
      }
    } else if (action === 'remove') {
      // Prevent removal if it's the only role
      if (employee.role.length === 1) {
        throw new Error('Cannot remove the only role');
      }
      
      // Remove the role if it exists
      if (employee.role.includes(role)) {
        employee.role = employee.role.filter(r => r !== role);
      } else {
        throw new Error('Role does not exist');
      }
    } else {
      throw new Error('Invalid action');
    }

    await employee.save();
    return employee;
  } catch (error) {
    throw new Error('Error updating role: ' + error.message);
  }
};
