const payrollRouter = require("express").Router();
const PayrollController = require("../controller/payroll");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");
const verifyTokenEmployee = require("../middleware/verifyTokenEmployee");

payrollRouter.post(
  "/payroll",
  verifyTokenAdmin,
  PayrollController.createPayroll
);
payrollRouter.get(
  "/payroll",
  verifyTokenEmployee,
  PayrollController.getPayroll
);

module.exports = payrollRouter;
