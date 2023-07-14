const dayjs = require("dayjs");
const db = require("../../models");

const clockIn = async (req, res) => {
  const userData = req.user;
  // console.log(userData);
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

    await db.Attendance.create({
      user_id: userData.userId,
      clock_in: currentTime,
      date: currentDate,
    });
    res.status(201).json({
      ok: true,
      message: "you are logged in",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

const clockOut = async (req, res) => {
  const userData = req.user;

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

    console.log("last clock in", lastClockIn);

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

    await db.Attendance.update(
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
      }
    );

    res.status(201).json({
      ok: true,
      message: "clocked out successful",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  clockOut,
  clockIn,
};
