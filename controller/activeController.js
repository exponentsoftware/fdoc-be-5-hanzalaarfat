const ActiveUserCday = require("../Models/Active_user");

exports.currentDay = async (req, res) => {
  await ActiveUserCday.find().exec((err, active) => {
    if (active) {
      res.status(200).json({ active });
    }
    if (err) {
      res.status(400).json({ todayActiveUsers: "No active users found" });
    }
  });
};

exports.currentMonth = async (req, res) => {
  await ActiveUser.find({ month: month }).exec((err, active) => {
    if (active) {
      res.status(200).json({ ActiveUsersByMonth: active.length });
    }
    if (err) {
      res.status(400).json({ ActiveUsersByMonth: "No active users found" });
    }
  });
};
