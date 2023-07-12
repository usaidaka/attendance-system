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

    if (user.role_id === 2) {
      await db.Attendance.create({
        user_id: user.id,
        clock_in: dayjs(),
      });
    }

    res.json({
      ok: true,
      message: "welcome, you are an admin",
      user_information: user,
      access_token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      message: "Account not found",
    });
  }
};

const logout = async (req, res) => {
  const userData = req.user;
  console.log(userData);
  try {
    if (!userData) {
      return res.status(403).json({
        ok: false,
        message: "unknown employee",
      });
    }
    const currentDate = dayjs().format("YYYY-MM-DD");
    // const testDate = dayjs("2023-07-13 16:04:10").format("YYYY-MM-DD");

    await db.Attendance.update(
      {
        clock_out: dayjs(),
      },
      {
        where: {
          user_id: userData.userId,
          clock_out: null,
          clock_in: { [db.Sequelize.Op.startsWith]: currentDate },
        },
      }
    );
    res.status(201).json({
      ok: true,
      message: "you are logged out",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const userData = req.user;

  console.log(userData.role);
  try {
    //check is admin
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
      role,
      first_name,
      last_name,
      birth_date,
      join_date,
      salary_id,
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

    const secret = process.env.ACCESS_TOKEN_SECRET + password;
    const token = jwt.sign({ email: email, role }, secret, {
      expiresIn: "30m",
    });

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
    const salaryData = await db.Salary.findOne({ where: { id: salary_id } });

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
      salary_id: salaryData.basic_salary,
    });

    const link = `${process.env.BASEPATH_FE_REACT}/register-employee/${token}`;

    const registerEmployee = { recipient_email: email, OTP, link };

    Mailer.sendEmailRegisterEmployee(registerEmployee)
      .then((response) =>
        res.status(200).json({
          ok: true,
          message: `${response.message}, your link and OTP will be expired on 30 minutes`,
        })
      )
      .catch((error) => res.status(500).send(error.message));
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  logout,
};
