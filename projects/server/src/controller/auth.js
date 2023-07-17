const Mailer = require("../controller/mailer");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const db = require("../../models");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne(
      {
        attributes: { exclude: ["user_id"] },
        where: {
          email: email,
        },
      },
      {}
    );

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "user not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        ok: false,
        message: "wrong password",
      });
    }

    const userId = user.id;
    const role = user.role_id;
    const emailEmp = user.email;

    const accessToken = jwt.sign(
      { userId, role, emailEmp },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      ok: true,
      message: "welcome!",
      user_information: user,
      access_token: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "server not responding",
    });
  }
};

const register = async (req, res) => {
  const userData = req.user;

  try {
    //check is admin
    if (!userData) {
      return res.status(400).json({
        ok: false,
        message: "token access needed",
      });
    }

    const isAdmin = userData.role;
    if (isAdmin !== 1) {
      return res.status(400).json({
        ok: false,
        message: "only admin can registering an employee account",
      });
    }
    const {
      email,
      password,
      confirmPassword,
      first_name,
      last_name,
      birth_date,
      join_date,
      salary,
    } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({
        ok: false,
        message: "password and confirm password have to match",
      });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const isEmailExist = await db.User.findOne({
      attributes: { exclude: ["user_id"] },
      where: { email: email },
    });
    if (isEmailExist) {
      return res.status(400).json({
        ok: false,
        message: "email already used",
      });
    }

    const OTP = Math.random(new Date().getTime() * 543241)
      .toString()
      .substring(2, 8);

    const time = dayjs();

    // create user
    await db.User.create({
      email: email,
      password: hashPassword,
      token_confirmation: OTP,
      token_confirmation_createdAt: time,
    });

    // create employee
    await db.Salary.create({ basic_salary: salary });
    const salaryData = await db.Salary.findOne({
      where: { basic_salary: salary },
    });

    const employeeData = await db.User.findOne({
      attributes: { exclude: ["user_id"] },
      where: { email: email },
    });

    await db.Employee.create({
      first_name: first_name,
      last_name: last_name,
      birth_date: birth_date,
      join_date: join_date,
      user_id: employeeData.id,
      salary_id: salaryData.id,
    });

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(
      { email: email, id: employeeData.id },
      secret /* {
      expiresIn: "30m",
    } */
    );

    const link = `${process.env.BASEPATH_FE_REACT}/update-employee/${token}`;

    const registerEmployee = { recipient_email: email, OTP, link };

    Mailer.sendEmailRegisterEmployee(registerEmployee)
      .then((response) =>
        res.status(201).json({
          ok: true,
          message: `${response.message}, your link and OTP will be expired on 30 minutes`,
        })
      )
      .catch((error) => res.status(500).send(error.message));
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  const { token } = req.params;

  try {
    if (token == null) {
      return res.status(401).json({
        ok: false,
        message: "token unauthorized",
      });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          ok: false,
          message: "Forbidden response",
        });
      }
      req.username = decoded.username;
      req.email = decoded.email;
    });
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    const {
      email,
      password,
      confirmPassword,
      first_name,
      last_name,
      birth_date,
      token_confirmation,
    } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({
        ok: false,
        message: "password and confirm password have to match",
      });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const token_user = await db.User.findOne({
      attributes: { exclude: ["user_id"] },
      where: { token_confirmation: token_confirmation },
    });

    if (!token_user) {
      return res.status(404).json({
        ok: false,
        message: "wrong OTP",
      });
    }

    // create user
    await db.User.update(
      {
        email: email,
        password: hashPassword,
        token_confirmation: null,
        token_confirmation_createdAt: null,
      },
      { where: { token_confirmation: token_confirmation } }
    );

    // create employee

    const employeeData = await db.User.findOne({
      attributes: { exclude: ["user_id", "token_confirmation"] },
      where: { email: req.user.email },
    });
    if (!employeeData) {
      return res.status(400).json({
        ok: false,
        message: "employee unregistered",
      });
    }

    await db.Employee.update(
      {
        first_name: first_name,
        last_name: last_name,
        birth_date: birth_date,
      },
      { where: { user_id: req.user.id } }
    );

    res.status(201).json({
      ok: true,
      message: "update employee data successful",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const employeeInformation = async (req, res) => {
  const userData = req.user;
  try {
    const employeeData = await db.Employee.findOne({
      include: [db.Salary],
      where: { user_id: userData.userId },
    });
    if (!employeeData) {
      return res.status(400).json({
        ok: false,
        message: "data not fount",
      });
    }
    res.status(200).json({
      ok: true,
      data: employeeData,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const getUserData = async (req, res) => {
  const userData = req.user;
  try {
    const user = await db.User.findOne({
      where: { id: userData.userId },
      attributes: {
        exclude: [
          "user_id",
          "token_confirmation",
          "token_confirmation_createdAt",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  updateEmployee,
  employeeInformation,
  getUserData,
};
