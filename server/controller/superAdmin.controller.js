const { addEmployeeService } = require("../services/superAdmin.services");

exports.addEmployeeController = async (req, res) => {
  try {
    console.log("first");
    const employeeData = req.body;
    const newEmployee = await addEmployeeService(employeeData);
    res.status(200).json({
      status: "success",
      message: "Employee Registration completed successfully",
      data: newEmployee,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
