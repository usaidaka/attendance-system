const AuthRouter = require("express").Router();
const AuthController = require("../controller/auth");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");
const verifyTokenEmployee = require("../middleware/verifyTokenEmploye");

AuthRouter.post("/auth/register", verifyTokenAdmin, AuthController.register);
AuthRouter.post("/auth/login", AuthController.login);
AuthRouter.patch("/auth/logout", verifyTokenEmployee, AuthController.logout);

module.exports = AuthRouter;
