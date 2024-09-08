const Employee = require("../model/Employee.model");
const Student = require("../model/Student.model");
const cloudinary = require("../config/cloudinary");

exports.createStudent = async (studentData) => {
  const session = await Student.startSession();
  session.startTransaction();
  try {
    // Create the student
    const newStudent = new Student(studentData);
    await newStudent.save({ session });

    // Update the employee document
    if (studentData.employees.asCounselor) {
      await Employee.findByIdAndUpdate(
        studentData.employees.asCounselor,
        { $addToSet: { "students.asCounselor": newStudent._id } },
        { session }
      );
    }
    console.log("Sssssssssssssss", newStudent);

    await session.commitTransaction();
    session.endSession();
    console.log(newStudent);

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(
      "Error creating student and updating employee: " + error.message
    );
  }
};
// exports.getAllStudentsByEmployeeID = async ({ employeeID, name, startDate, endDate }) => {
//   try {
//     const employee = await Employee.findById(employeeID)
//       .populate({
//         path: "students.asCounselor students.asApplicant students.asVisaAdmin",
//       })
//       .exec();
//     console.log("employee", employee);
//     if (!employee) {
//       throw new Error("Employee not found");
//     }

//     // Aggregate all student lists based on roles
//     const allStudents = [
//       ...employee.students.asCounselor,
//       ...employee.students.asApplicant,
//       ...employee.students.asVisaAdmin,
//     ];

//     console.log('All Students:', allStudents);

//     // Apply filters to the aggregated students
//     let filteredStudents = allStudents;

//     // Filter by name if provided
//     if (name) {
//       const nameRegex = new RegExp(name, 'i'); // Case-insensitive search
//       filteredStudents = filteredStudents.filter((student) => nameRegex.test(student.fullName));
//     }

//     // Filter by date range if provided
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       filteredStudents = filteredStudents.filter(
//         (student) => new Date(student.dob) >= start && new Date(student.dob) <= end
//       );
//     } else if (startDate) {
//       const start = new Date(startDate);
//       filteredStudents = filteredStudents.filter((student) => new Date(student.dob) >= start);
//     } else if (endDate) {
//       const end = new Date(endDate);
//       filteredStudents = filteredStudents.filter((student) => new Date(student.dob) <= end);
//     }

//     // Remove duplicates if any (in case a student appears in multiple roles)
//     const uniqueStudents = Array.from(
//       new Set(filteredStudents.map((s) => s._id.toString()))
//     ).map((id) => filteredStudents.find((s) => s._id.toString() === id));

//     return filteredStudents;
//   } catch (error) {
//     console.error('Error in getStudentsByEmployee service:', error);
//     throw error;
//   }
// };

// exports.getAllStudents = async ({ name, startDate, endDate }) => {
//   try {
//     const filter = {};

//     // Filter by name if provided
//     if (name) {
//       filter.fullName = new RegExp(name, 'i'); // Case-insensitive search
//     }

//     // Filter by date range if provided
//     if (startDate && endDate) {
//       filter.dob = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else if (startDate) {
//       filter.dob = { $gte: new Date(startDate) };
//     } else if (endDate) {
//       filter.dob = { $lte: new Date(endDate) };
//     }
//     // Find the employee and populate students based on roles
//     const students = await Student.find(filter)
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
// }) => {
//   try {
//     const employee = await Employee.findById(employeeID)
//       .populate({
//         path: "students.asCounselor students.asApplicant students.asVisaAdmin",
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
//     console.log("ccc", country);
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

//     // Find students with the given filters
//     const students = await Student.find(filter).populate("courses");

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


exports.getAllStudentsByEmployeeID = async ({
  employeeID,
  name,
  startDate,
  endDate,
  country,
}) => {
  try {
    const employee = await Employee.findById(employeeID)
      .populate({
        path: "students.asCounselor students.asApplicant students.asVisaAdmin",
        populate: {
          path: "courses", // Populate courses within each student
          model: "Course", // Ensure this is the correct model name
          select: "name country", // Select only the necessary fields from courses
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
      const nameRegex = new RegExp(name, "i"); // Case-insensitive search
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
      const countryRegex = new RegExp(country, "i"); // Case-insensitive search

      // Check if filteredStudents and student.courses are correctly initialized
      console.log("Initial Students:", filteredStudents);

      filteredStudents = filteredStudents.filter((student) => {
        console.log("Student:", student.fullName, "Courses:", student.courses); // Debug each student's courses

        if (!student.courses || student.courses.length === 0) {
          console.warn("No courses found for student:", student.fullName);
          return false;
        }

        // Filter students based on courses' country matching the regex
        const matches = student.courses.some((course) => {
          console.log(
            "Checking course:",
            course.name,
            "Country:",
            course.country
          ); // Debug each course's country
          return countryRegex.test(course.country);
        });

        return matches;
      });

      console.log("Filtered Students by Country:", filteredStudents); // Check the result after filtering
    }

    // Remove duplicates if any (in case a student appears in multiple roles)
    const uniqueStudents = Array.from(
      new Set(filteredStudents.map((s) => s._id.toString()))
    ).map((id) => filteredStudents.find((s) => s._id.toString() === id));

    return uniqueStudents;
  } catch (error) {
    console.error("Error in getStudentsByEmployee service:", error);
    throw error;
  }
};

exports.getAllStudents = async ({ name, startDate, endDate, country }) => {
  try {
    const filter = {};

    // Filter by name if provided
    if (name) {
      filter.fullName = new RegExp(name, "i"); // Case-insensitive search
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
      path: "courses", // Populate courses field
      select: "name country", // Select only the necessary fields from courses
    });

    // Filter by country if provided
    if (country) {
      const countryRegex = new RegExp(country, "i"); // Case-insensitive search
      return students.filter((student) =>
        student.courses.some((course) => countryRegex.test(course.country))
      );
    }

    return students;
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
