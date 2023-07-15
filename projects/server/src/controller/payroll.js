const db = require("../../models");
const dayjs = require("dayjs");

const createPayroll = async (req, res) => {
  try {
    const countValid = await db.Attendance.findAll({
      where: { isValid: true },
      attributes: [
        "user_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("isValid")), "isValidCount"],
      ],
      group: ["user_id"],
    });

    const countNotValid = await db.Attendance.findAll({
      where: { isValid: false },
      attributes: [
        "user_id",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("isValid")),
          "isNotValidCount",
        ],
      ],
      group: ["user_id"],
    });

    const salary = await db.Employee.findAll({
      include: [db.Salary],
    });

    const totalDayInMonth = 21;
    const payroll = salary.map((employee) => {
      const isValidCount = countValid.find(
        (count) => count.user_id === employee.user_id
      );
      const isNotValidCount = countNotValid.find(
        (count) => count.user_id === employee.user_id
      );

      const salaryPerDay = Math.ceil(
        employee.Salary.basic_salary / totalDayInMonth
      );

      let totalSalary = salaryPerDay * isValidCount?.get("isValidCount") || 0;
      totalSalary +=
        (salaryPerDay / 2) * isNotValidCount?.get("isNotValidCount") || 0;

      return {
        user_id: employee.user_id,
        totalSalary,
      };
    });

    const currentDate = dayjs().format("YYYY-MM-DD");

    const currentDateString = currentDate
      .toString()
      .slice(0, 19)
      .replace("T", " ")
      .split(" ")[0]
      .split("-")
      .slice(0, 2)
      .join("-");

    console.log("curdate string", currentDateString);

    const isPayrolled = await db.Payroll.findAll();
    // console.log(isPayrolled);
    const isEmployeePaidOff = isPayrolled
      .map((data) =>
        data.date
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .split(" ")[0]
          .split("-")
          .slice(0, 2)
          .join("-")
      )
      .filter((date) => date == currentDateString);

    console.log(isEmployeePaidOff);
    if (isEmployeePaidOff.length !== 0) {
      return res.status(400).json({
        ok: false,
        message: "The employee has been paid this month",
      });
    }

    for (const data of payroll) {
      console.log("data salary", data);
      await db.Payroll.create({
        user_id: data.user_id,
        date: currentDate,
        deduction: 0,
        payroll: data.totalSalary,
      });
    }

    res.json({
      ok: true,
      payroll,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve payroll.",
    });
  }
};

const getPayroll = async (req, res) => {
  const userData = req.user;

  const sixMonthsAgo = dayjs()
    .subtract(6, "month")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  const endDate = dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss");

  const startDate = req.query.startDate
    ? dayjs(req.query.startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss")
    : sixMonthsAgo;
  const endDateQuery = req.query.endDate
    ? dayjs(req.query.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")
    : endDate;

  const pagination = {
    page: Number(req.query.page) || 1,
    perPage: 5,
  };
  const offset = (pagination.page - 1) * pagination.perPage;

  try {
    const payrollData = await db.Payroll.findAndCountAll({
      where: {
        user_id: userData.userId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDateQuery],
        },
      },
      limit: pagination.perPage,
      offset,
      order: [["date", "DESC"]],
    });

    if (!payrollData) {
      return res.status(400).json({
        ok: false,
        message: "Employee's payroll data not found",
      });
    }

    console.log("count", payrollData.count);

    res.status(200).json({
      ok: true,
      data: payrollData.rows,
      totalItems: payrollData.count,
      currentPage: pagination.page,
      totalPages: Math.ceil(payrollData.count / pagination.perPage),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayroll,
  getPayroll,
};
