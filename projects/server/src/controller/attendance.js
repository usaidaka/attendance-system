const dayjs = require("dayjs");
const db = require("../../models");

const clockIn = async (req, res) => {
  const userData = req.user;
  const t = await db.sequelize.transaction();

  try {
    if (!userData) {
      return res.status(403).json({
        ok: false,
        message: "unknown employee",
      });
    }
    const currentTime = dayjs().format("HH:mm:ss");
    const currentDate = dayjs().format("YYYY-MM-DD");

    const weekend = dayjs().get("date");
    if (Number(weekend) === 6 || Number(weekend) === 0) {
      return res.status(400).json({
        ok: false,
        message: "its weekend, relax your day",
      });
    }

    const isClockedIn = await db.Attendance.findOne({
      where: { user_id: userData.userId },
      limit: 1,
      order: [["id", "desc"]],
    });

    if (isClockedIn) {
      const lastClockInDate = isClockedIn.date;
      const lastClockInDateString = lastClockInDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
        .split(" ")[0];

      const clockedInTwice = new Date();
      const currentClockInTwiceDateString = clockedInTwice
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
        .split(" ")[0];

      if (lastClockInDateString === currentClockInTwiceDateString) {
        return res.status(400).json({
          ok: false,
          message: "you have clocked in today",
        });
      }
    }

    const clock = await db.Attendance.create(
      {
        user_id: userData.userId,
        clock_in: currentTime,
        date: currentDate,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({
      ok: true,
      message: "you are logged in",
      data: clock,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const clockOut = async (req, res) => {
  const userData = req.user;
  const t = await db.sequelize.transaction();
  try {
    if (!userData) {
      return res.status(403).json({
        ok: false,
        message: "unknown employee",
      });
    }
    const currentTime = dayjs().format("HH:mm:ss");

    const weekend = dayjs().get("date");
    if (Number(weekend) === 6 || Number(weekend) === 0) {
      return res.status(400).json({
        ok: false,
        message: "you can't clock out on weekend",
      });
    }

    const lastClockIn = await db.Attendance.findOne({
      where: { user_id: userData.userId },
      limit: 1,
      order: [["id", "desc"]],
    });

    if (!lastClockIn.clock_in) {
      return res.status(400).json({
        ok: false,
        message: "you are not logged in yet",
      });
    }

    const lastClockInDate = lastClockIn.date;
    const lastClockInDateString = lastClockInDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
      .split(" ")[0];

    const currentClockOutDate = new Date();
    const currentClockOutDateString = currentClockOutDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
      .split(" ")[0];

    if (lastClockInDateString !== currentClockOutDateString) {
      return res.status(400).json({
        ok: false,
        message: "You missed clock out yesterday ",
      });
    }
    if (lastClockIn.clock_out !== null) {
      return res.status(400).json({
        ok: false,
        message: "you have been clocked out",
      });
    }

    const clock = await db.Attendance.update(
      {
        clock_out: currentTime,
        isValid: true,
      },
      {
        where: {
          user_id: userData.userId,
          clock_out: null,
          id: lastClockIn.id,
        },
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({
      ok: true,
      message: "clocked out successful",
      data: clock,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const getLatestClock = async (req, res) => {
  const userData = req.user;
  try {
    const lastClock = await db.Attendance.findOne({
      where: { user_id: userData.userId },
      limit: 1,
      order: [["id", "desc"]],
    });
    res.status(200).json({
      ok: true,
      data: lastClock,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const employeeAbsentById = async (req, res) => {
  const userData = req.user;

  const startDate = req.query.startDate
    ? dayjs(req.query.startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss")
    : dayjs().subtract(1, "year").startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const endDate = req.query.endDate
    ? dayjs(req.query.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")
    : dayjs().add(1, "day").endOf("day").format("YYYY-MM-DD HH:mm:ss");

  const pagination = {
    page: Number(req.query.page) || 1,
    perPage: 5,
  };
  const offset = (pagination.page - 1) * pagination.perPage;

  try {
    const absent = await db.Attendance.findAndCountAll({
      where: {
        user_id: userData.userId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate],
        },
      },
      limit: pagination.perPage,
      offset,
      order: [["date", "DESC"]],
    });

    if (!absent) {
      return res.status(400).json({
        ok: false,
        message: "Employee's absent data not found",
      });
    }

    res.status(200).json({
      ok: true,
      data: absent.rows,
      totalItems: absent.count,
      currentPage: pagination.page,
      totalPages: Math.ceil(absent.count / pagination.perPage),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  clockOut,
  clockIn,
  getLatestClock,
  employeeAbsentById,
};
