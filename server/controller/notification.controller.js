const {
  getNotificationServices,
  markAsReadNotificationServices,
} = require("../services/notification.service");

exports.getNotificationController = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const request = await getNotificationServices(employeeId);
    if (request) {
      res.status(200).json({
        status: "Success",
        message: "LogIn successfully",
        data: request,
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.markAsReadNotificationController = async (req, res, next) => {
  try {
    const request = await markAsReadNotificationServices(req.params.id);
    res.status(200).json({
      status: "Success",
      message: "update successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
