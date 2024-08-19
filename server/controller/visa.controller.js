const Visa = require('../model/Visa.model')
const cloudinary = require("../config/cloudinary");
const Student = require("../model/Student.model");
const { getAVisa,uploadVisaDocument } = require('../services/visa.service');
// const {
//   getAVisa,
//   ,
// } = require("../services/visa.service");

exports.addVisaController = async (req, res) => {
  try {
    console.log("Adding visa and updating student");

    // Destructure course data from the request body
    const { course, university, country, studentId, assignedBy } = req.body;

    console.log("ohohooh",req.body);

    // Create a new visa instance
    const newVisa = new Visa({
      country,
      course: {
        courseName: course,
        courseUniversity: university,
      },
      student: {
        _id: studentId, // Reference to the student
      },
      assignedBy: {
        name: assignedBy.name,
        _id: assignedBy._id, // Reference to the employee who assigned this
      },
    });

    console.log("newVisa", newVisa);

    //     // Save the new course to the database
    const savedVisa = await newVisa.save();

        // Update the student's courses array with the new course ID
    await Student.findByIdAndUpdate(studentId, {
      $push: { visas: savedVisa._id },
    });

    // //     // Optionally, you can fetch the updated student data if needed
    const updatedStudent = await Student.findById(studentId).populate("visas");

    //     // Respond with the saved course and updated student data
    res.status(201).json({ savedVisa, updatedStudent });
  } catch (error) {
    res.status(500).json({ message: " aaaaaaa Failed to add course", error });
  }
};
exports.getAVisaController = async (req, res) => {
  const { visaId } = req.params;
  console.log("bbbbbbbbbbbbbbbbbbbbbb", visaId);
  try {
    const visa = await getAVisa(visaId);
    console.log("visa", visa);
    res.status(200).json(visa);
  } catch (error) {
    console.error("Error fetching visa:", error);
    res.status(500).json({ error: "Failed to fetch visa" });
  }
};
exports.uploadADocumentController = async (req, res) => {
  try {
    console.log("bbbbbbbbbbbbbbbbbbbbbb", req.file);
    console.log("hittttttttttttttttttt");
    const { visaId } = req.params;
    const { documentName } = req.body;
    console.log("xxxxxxxxxxxxxxxx", visaId, documentName, req.file);

    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `visa/${documentName}`,
    });

    const uploadedDocument = await uploadVisaDocument(
      visaId,
      documentName,
      fileUpload.secure_url
    );

    res.status(200).json({
      status: "success",
      message: "Document upload completed successfully",
      data: uploadedDocument,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
