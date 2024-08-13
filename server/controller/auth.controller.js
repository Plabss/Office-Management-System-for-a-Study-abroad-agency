const { loginService } = require('../services/auth.service');

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await loginService(email, password);

    // Return employee data on successful login
    res.status(200).json({
      status: 'success',
      employee,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
