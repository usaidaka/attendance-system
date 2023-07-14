import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      const time = now.format("HH:mm:ss");
      const date = now.locale("en").format("D MMMM YYYY");
      setCurrentTime(time);
      setCurrentDate(date);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <h1 className="text-4xl text-black">{currentTime}</h1>
      <h1>{currentDate}</h1>
    </div>
  );
};

export default Clock;
