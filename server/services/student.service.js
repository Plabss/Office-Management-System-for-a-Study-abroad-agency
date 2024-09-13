const Employee = require("../model/Employee.model");
const Student = require("../model/Student.model");
const cloudinary = require("../config/cloudinary");
const bcrypt = require('bcryptjs')

exports.createStudent = async (studentData) => {
  const session = await Student.startSession();
  session.startTransaction();
  try {
    // Generate a random six-digit password
    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("r",randomPassword)

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Create the student with the hashed password
    const newStudent = new Student({
      ...studentData,
      password: hashedPassword,
    });

    await newStudent.save({ session });

    // Update the employee document
    if (studentData.employees.asCounselor) {
      await Employee.findByIdAndUpdate(
        studentData.employees.asCounselor,
        { $addToSet: { "students.asCounselor": newStudent._id } },
        { session }
      );
    }
    console.log("New student created with password:", randomPassword); // For testing purposes

    await session.commitTransaction();
    session.endSession();
    console.log(newStudent);

    // You can choose to send the password to the student via email or other secure means here
    // For example: sendEmail(newStudent.email, randomPassword);

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(
      "Error creating student and updating employee: " + error.message
    );
  }
};

// exports.getAllStudentsByEmployeeID = async ({
//   employeeID,
//   name,
//   startDate,
//   endDate,
//   country,
// }) => {
//   try {
//     const employee = await Employee.findById(employeeID)
//       .populate({
//         path: "students.asCounselor students.asApplicant students.asVisaAdmin",
//         populate: {
//           path: "courses", // Populate courses within each student
//           model: "Course", // Ensure this is the correct model name
//           select: "name country", // Select only the necessary fields from courses
//         },
//       })
//       .exec();

//     if (!employee) {
//       throw new Error("Employee not found");
//     }

//     // Aggregate all student lists based on roles
//     const allStudents = [
//       ...employee.students.asCounselor,
//       ...employee.students.asApplicant,
//       ...employee.students.asVisaAdmin,
//     ];

//     // Apply filters to the aggregated students
//     let filteredStudents = allStudents;

//     // Filter by name if provided
//     if (name) {
//       const nameRegex = new RegExp(name, "i"); // Case-insensitive search
//       filteredStudents = filteredStudents.filter((student) =>
//         nameRegex.test(student.fullName)
//       );
//     }

//     // Filter by date range if provided
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       filteredStudents = filteredStudents.filter(
//         (student) =>
//           new Date(student.dob) >= start && new Date(student.dob) <= end
//       );
//     } else if (startDate) {
//       const start = new Date(startDate);
//       filteredStudents = filteredStudents.filter(
//         (student) => new Date(student.dob) >= start
//       );
//     } else if (endDate) {
//       const end = new Date(endDate);
//       filteredStudents = filteredStudents.filter(
//         (student) => new Date(student.dob) <= end
//       );
//     }

//     // Filter by country if provided
//     if (country) {
//       const countryRegex = new RegExp(country, "i"); // Case-insensitive search

//       // Check if filteredStudents and student.courses are correctly initialized
//       console.log("Initial Students:", filteredStudents);

//       filteredStudents = filteredStudents.filter((student) => {
//         console.log("Student:", student.fullName, "Courses:", student.courses); // Debug each student's courses

//         if (!student.courses || student.courses.length === 0) {
//           console.warn("No courses found for student:", student.fullName);
//           return false;
//         }

//         // Filter students based on courses' country matching the regex
//         const matches = student.courses.some((course) => {
//           console.log(
//             "Checking course:",
//             course.name,
//             "Country:",
//             course.country
//           ); // Debug each course's country
//           return countryRegex.test(course.country);
//         });

//         return matches;
//       });

//       console.log("Filtered Students by Country:", filteredStudents); // Check the result after filtering
//     }

//     // Remove duplicates if any (in case a student appears in multiple roles)
//     const uniqueStudents = Array.from(
//       new Set(filteredStudents.map((s) => s._id.toString()))
//     ).map((id) => filteredStudents.find((s) => s._id.toString() === id));

//     return uniqueStudents;
//   } catch (error) {
//     console.error("Error in getStudentsByEmployee service:", error);
//     throw error;
//   }
// };

// exports.getAllStudents = async ({ name, startDate, endDate, country }) => {
//   try {
//     const filter = {};

//     // Filter by name if provided
//     if (name) {
//       filter.fullName = new RegExp(name, "i"); // Case-insensitive search
//     }

//     // Filter by date range if provided
//     if (startDate && endDate) {
//       filter.dob = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else if (startDate) {
//       filter.dob = { $gte: new Date(startDate) };
//     } else if (endDate) {
//       filter.dob = { $lte: new Date(endDate) };
//     }

//     // Find students with the given filters and populate their courses
//     const students = await Student.find(filter).populate({
//       path: "courses", // Populate courses field
//       select: "name country", // Select only the necessary fields from courses
//     });

//     // Filter by country if provided
//     if (country) {
//       const countryRegex = new RegExp(country, "i"); // Case-insensitive search
//       return students.filter((student) =>
//         student.courses.some((course) => countryRegex.test(course.country))
//       );
//     }

//     return students;
//   } catch (error) {
//     console.error("Error in getStudents service:", error);
//     throw error;
//   }
// };


// exports.getAllStudentsByEmployeeID = async ({
//   employeeID,
//   name,
//   startDate,
//   endDate,
//   country,
//   page = 1,  // Default page number
//   limit = 2,  // Default limit
// }) => {
//   try {
//     const employee = await Employee.findById(employeeID)
//       .populate({
//         path: "students.asCounselor students.asApplicant students.asVisaAdmin",
//         populate: {
//           path: "courses",
//           model: "Course",
//           select: "name country",
//         },
//       })
//       .exec();

//     if (!employee) {
//       throw new Error("Employee not found");
//     }

//     // Aggregate all student lists based on roles
//     const allStudents = [
//       ...employee.students.asCounselor,
//       ...employee.students.asApplicant,
//       ...employee.students.asVisaAdmin,
//     ];

//     // Apply filters to the aggregated students
//     let filteredStudents = allStudents;

//     // Filter by name if provided
//     if (name) {
//       const nameRegex = new RegExp(name, "i");
//       filteredStudents = filteredStudents.filter((student) =>
//         nameRegex.test(student.fullName)
//       );
//     }

//     // Filter by date range if provided
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       filteredStudents = filteredStudents.filter(
//         (student) =>
//           new Date(student.dob) >= start && new Date(student.dob) <= end
//       );
//     } else if (startDate) {
//       const start = new Date(startDate);
//       filteredStudents = filteredStudents.filter(
//         (student) => new Date(student.dob) >= start
//       );
//     } else if (endDate) {
//       const end = new Date(endDate);
//       filteredStudents = filteredStudents.filter(
//         (student) => new Date(student.dob) <= end
//       );
//     }

//     // Filter by country if provided
//     if (country) {
//       const countryRegex = new RegExp(country, "i");
//       filteredStudents = filteredStudents.filter((student) => {
//         if (!student.courses || student.courses.length === 0) {
//           return false;
//         }
//         return student.courses.some((course) => countryRegex.test(course.country));
//       });
//     }

//     // Remove duplicates if any (in case a student appears in multiple roles)
//     const uniqueStudents = Array.from(
//       new Set(filteredStudents.map((s) => s._id.toString()))
//     ).map((id) => filteredStudents.find((s) => s._id.toString() === id));

//     // Pagination logic
//     const totalStudents = uniqueStudents.length;  // Total number of unique students
//     const totalPages = Math.ceil(totalStudents / limit);
//     const paginatedStudents = uniqueStudents.slice((page - 1) * limit, page * limit);

//     return {
//       students: paginatedStudents,
//       totalPages,
//       currentPage: page,
//     };
//   } catch (error) {
//     console.error("Error in getStudentsByEmployee service:", error);
//     throw error;
//   }
// };
// exports.getAllStudents = async ({ name, startDate, endDate, country, page = 1, limit = 2 }) => {
//   try {
//     const filter = {};

//     // Filter by name if provided
//     if (name) {
//       filter.fullName = new RegExp(name, "i");
//     }

//     // Filter by date range if provided
//     if (startDate && endDate) {
//       filter.dob = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else if (startDate) {
//       filter.dob = { $gte: new Date(startDate) };
//     } else if (endDate) {
//       filter.dob = { $lte: new Date(endDate) };
//     }

//     // Find students with the given filters and populate their courses
//     const students = await Student.find(filter).populate({
//       path: "courses",
//       select: "name country",
//     });

//     // Filter by country if provided
//     let filteredStudents = students;
//     if (country) {
//       const countryRegex = new RegExp(country, "i");
//       filteredStudents = students.filter((student) =>
//         student.courses.some((course) => countryRegex.test(course.country))
//       );
//     }

//     // Pagination logic
//     const totalStudents = filteredStudents.length;  // Total number of students after filtering
//     const totalPages = Math.ceil(totalStudents / limit);
//     const paginatedStudents = filteredStudents.slice((page - 1) * limit, page * limit);

//     return {
//       students: paginatedStudents,
//       totalPages,
//       currentPage: page,
//     };
//   } catch (error) {
//     console.error("Error in getStudents service:", error);
//     throw error;
//   }
// };

// studentController.js

// const Student = require('../models/Student');
// const Employee = require('../models/Employee');

// Service to get students by Employee ID with pagination and filtering
exports.getAllStudentsByEmployeeID = async ({
  employeeID,
  name,
  startDate,
  endDate,
  country,
  page = 1,  // Default page number
  limit = 2,  // Default limit of items per page
}) => {
  try {
    const employee = await Employee.findById(employeeID)
      .populate({
        path: "students.asCounselor students.asApplicant students.asVisaAdmin",
        populate: {
          path: "courses",
          model: "Course",
          select: "name country",
        },
      })
      .exec();

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Aggregate all student lists based on roles
    const allStudents = [
      ...employee.students.asCounselor,
      ...employee.students.asApplicant,
      ...employee.students.asVisaAdmin,
    ];

    // Apply filters to the aggregated students
    let filteredStudents = allStudents;

    // Filter by name if provided
    if (name) {
      const nameRegex = new RegExp(name, "i");
      filteredStudents = filteredStudents.filter((student) =>
        nameRegex.test(student.fullName)
      );
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredStudents = filteredStudents.filter(
        (student) =>
          new Date(student.dob) >= start && new Date(student.dob) <= end
      );
    } else if (startDate) {
      const start = new Date(startDate);
      filteredStudents = filteredStudents.filter(
        (student) => new Date(student.dob) >= start
      );
    } else if (endDate) {
      const end = new Date(endDate);
      filteredStudents = filteredStudents.filter(
        (student) => new Date(student.dob) <= end
      );
    }

    // Filter by country if provided
    if (country) {
      const countryRegex = new RegExp(country, "i");
      filteredStudents = filteredStudents.filter((student) => {
        if (!student.courses || student.courses.length === 0) {
          return false;
        }
        return student.courses.some((course) => countryRegex.test(course.country));
      });
    }

    // Remove duplicates if any (in case a student appears in multiple roles)
    const uniqueStudents = Array.from(
      new Set(filteredStudents.map((s) => s._id.toString()))
    ).map((id) => filteredStudents.find((s) => s._id.toString() === id));

    // Pagination logic
    const totalStudents = uniqueStudents.length;  // Total number of unique students
    const totalPages = Math.ceil(totalStudents / limit);
    const paginatedStudents = uniqueStudents.slice((page - 1) * limit, page * limit);

    return {
      students: paginatedStudents,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in getStudentsByEmployee service:", error);
    throw error;
  }
};

// Service to get all students with pagination and filtering
exports.getAllStudents = async ({ name, startDate, endDate, country, page = 1, limit = 2 }) => {
  try {
    const filter = {};

    // Filter by name if provided
    if (name) {
      filter.fullName = new RegExp(name, "i");
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      filter.dob = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.dob = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.dob = { $lte: new Date(endDate) };
    }

    // Find students with the given filters and populate their courses
    const students = await Student.find(filter).populate({
      path: "courses",
      select: "name country",
    });

    // Filter by country if provided
    let filteredStudents = students;
    if (country) {
      const countryRegex = new RegExp(country, "i");
      filteredStudents = students.filter((student) =>
        student.courses.some((course) => countryRegex.test(course.country))
      );
    }

    // Pagination logic
    const totalStudents = filteredStudents.length;  // Total number of students after filtering
    const totalPages = Math.ceil(totalStudents / limit);
    const paginatedStudents = filteredStudents.slice((page - 1) * limit, page * limit);

    return {
      students: paginatedStudents,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in getStudents service:", error);
    throw error;
  }
};

exports.getAStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId)
      .populate({
        path: "employees.asCounselor employees.asApplicant employees.asVisaAdmin",
        select: "name _id", // Only populates `name` and `_id` from Employee
      })
      .populate({
        path: "courses",
      })
      .populate({
        path: "visas",
      })
      .exec();
    console.log("studentttttttt", student);
    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};
exports.uploadDocument = async (studentId, documentName, file) => {
  try {
    console.log(file);
    const student = await Student.findOneAndUpdate(
      { _id: studentId },
      {
        [`documents.${documentName}`]: file,
      }
    );
    return student;
  } catch (error) {
    console.error("Error in uploadDocument service:", error);
    throw error;
  }
};

// Service to add an employee to a student's employee list
exports.addEmployeeToStudentService = async (studentId, employeeId, role) => {
  try {
    // Find the student and employee
    const student = await Student.findById(studentId);
    const employee = await Employee.findById(employeeId);

    if (!student || !employee) {
      throw new Error('Student or Employee not found');
    }

    console.log("ssss", student);
    console.log('eeeeee', employee);

    // Check which category (counselor, applicant, visaAdmin) to add
    if (role === 'counselor') {
      if (!student.employees.asCounselor.includes(employeeId)) {
        student.employees.asCounselor.push(employeeId);
        employee.students.asCounselor.push(studentId);
      }
    } else if (role === 'applicant') {
      if (!student.employees.asApplicant.includes(employeeId)) {
        student.employees.asApplicant.push(employeeId);
        employee.students.asApplicant.push(studentId);
      }
    } else if (role === 'visaAdmin') {
      if (!student.employees.asVisaAdmin.includes(employeeId)) {
        student.employees.asVisaAdmin.push(employeeId);
        employee.students.asVisaAdmin.push(studentId);
      }
    } else {
      throw new Error('Invalid category');
    }

    // Save both the student and employee
    await student.save();
    await employee.save();

    return student;
  } catch (error) {
    console.error('Error in addEmployeeToStudentService:', error);
    throw error;
  }
};

// Service to remove an employee from a student's employee list
exports.removeEmployeeFromStudentService = async (studentId, employeeId, role) => {
  try {
    // Find the student and employee
    const student = await Student.findById(studentId);
    const employee = await Employee.findById(employeeId);

    if (!student || !employee) {
      throw new Error('Student or Employee not found');
    }

    // Check which category (counselor, applicant, visaAdmin) to remove
    if (role === 'counselor') {
      student.employees.asCounselor = student.employees.asCounselor.filter(id => id.toString() !== employeeId);
      employee.students.asCounselor = employee.students.asCounselor.filter(id => id.toString() !== studentId);
    } else if (role === 'applicant') {
      student.employees.asApplicant = student.employees.asApplicant.filter(id => id.toString() !== employeeId);
      employee.students.asApplicant = employee.students.asApplicant.filter(id => id.toString() !== studentId);
    } else if (role === 'visaAdmin') {
      student.employees.asVisaAdmin = student.employees.asVisaAdmin.filter(id => id.toString() !== employeeId);
      employee.students.asVisaAdmin = employee.students.asVisaAdmin.filter(id => id.toString() !== studentId);
    } else {
      throw new Error('Invalid category');
    }

    // Save both the student and employee
    await student.save();
    await employee.save();

    return student;
  } catch (error) {
    console.error('Error in removeEmployeeFromStudentService:', error);
    throw error;
  }
};

