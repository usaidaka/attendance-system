const AttendanceRouter = require("express").Router();
const AttendanceController = require("../controller/attendance");
const verifyTokenEmployee = require("../middleware/verifyTokenEmployee");

AttendanceRouter.post(
  "/attendance/clock-in",
  verifyTokenEmployee,
  AttendanceController.clockIn
);
AttendanceRouter.patch(
  "/attendance/clock-out",
  verifyTokenEmployee,
  AttendanceController.clockOut
);

AttendanceRouter.get(
  "/attendance/track",
  verifyTokenEmployee,
  AttendanceController.getLatestClock
);

AttendanceRouter.get(
  "/attendance/absent",
  verifyTokenEmployee,
  AttendanceController.employeeAbsentById
);

module.exports = AttendanceRouter;
