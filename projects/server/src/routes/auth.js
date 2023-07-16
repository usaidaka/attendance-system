const AuthRouter = require("express").Router();
const AuthController = require("../controller/auth");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");
const verifyTokenEmployee = require("../middleware/verifyTokenEmployee");
const verifyToken = require("../middleware/verifyToken");

AuthRouter.post("/auth/register", verifyTokenAdmin, AuthController.register);
AuthRouter.post("/auth/login", AuthController.login);
AuthRouter.patch("/auth/employee-data/:token", AuthController.updateEmployee);

AuthRouter.get(
  "/auth/employee-data",
  verifyTokenEmployee,
  AuthController.employeeInformation
);
AuthRouter.get(
  "/auth/user-information",
  verifyToken,
  AuthController.getUserData
);

module.exports = AuthRouter;
