const AttendanceRouter = require("express").Router();
const AttendanceController = require("../controller/attendance");
const verifyTokenEmployee = require("../middleware/verifyTokenEmployee");

AttendanceRouter.post(
  "/attendance/clock-in",
  verifyTokenEmployee,
  AttendanceController.clockIn
);
AttendanceRouter.post(
  "/attendance/clock-out",
  verifyTokenEmployee,
  AttendanceController.clockOut
);

module.exports = AttendanceRouter;
