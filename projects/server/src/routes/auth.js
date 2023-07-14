const AuthRouter = require("express").Router();
const AuthController = require("../controller/auth");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");
const verifyTokenEmployee = require("../middleware/verifyTokenEmployee");

AuthRouter.post("/auth/register", verifyTokenAdmin, AuthController.register);
AuthRouter.post("/auth/login", AuthController.login);
AuthRouter.patch("/auth/employee-data/:token", AuthController.updateEmployee);
AuthRouter.get("/auth/employee-data/:token", AuthController.getEmployeeData);

module.exports = AuthRouter;
