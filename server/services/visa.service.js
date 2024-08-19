const Visa = require("../model/Visa.model");
exports.getAVisa = async (visaID) => {
  try {
    // Find the student by ID and populate the courses array with course details
    const visa = await Visa.findById(visaID);
    return visa;
  } catch (error) {
    console.error("Error in getACourse service:", error);
    throw error;
  }
};

exports.uploadVisaDocument = async (visaId, documentName, file) => {
  try {
    console.log(file);
    const visa = await Visa.findOneAndUpdate({"_id":visaId}, {
      [`documents.${documentName}`]: file,
    })
    return visa;
  } catch (error) {
    console.error("Error in uploadCourseDocument service:", error);
    throw error;
  }
};


