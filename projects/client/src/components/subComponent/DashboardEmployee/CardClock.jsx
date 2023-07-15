import React, { useState } from "react";
import {
  BoltIcon,
  BoltSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const CardClock = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [attendance, setAttendance] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClockIn = () => {
    try {
      axios
        .post(
          "/attendance/clock-in",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setIsSuccess(res);
          axios
            .get("/attendance/track", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAttendance(res.data?.data));
        })
        .catch((err) => setErrMsg(err?.response?.data?.message));
    } catch (error) {
      console.log(error);
      setErrMsg(error);
    }
  };

  const handleClockOut = () => {
    try {
      axios
        .patch(
          "/attendance/clock-out",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setClockOut(res.data?.message);
          axios
            .get("/attendance/track", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAttendance(res.data?.data));
        })
        .catch((err) => setErrMsg(err?.response?.data?.message));
    } catch (error) {
      console.log(error);
      setErrMsg(error);
    }
  };

  const handleLogOut = () => {
    navigate("/");
    localStorage.removeItem("token");
  };

  return (
    <div className="bg-white w-64 mt-20 rounded-xl lg:w-[1000px] shadow-xl">
      <div>
        {errMsg ? (
          <div className="w-60 mx-auto rounded-md absolute top-5 right-7 bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:mx-auto">
            <p className="bg-inherit">{errMsg}</p>
            <button
              className="w-5 absolute right-1"
              onClick={() => {
                setErrMsg("");
              }}
            >
              <XMarkIcon />
            </button>
          </div>
        ) : isSuccess ? (
          <div className="w-60 mx-auto rounded-md absolute top-5 right-7 bg-blue-200 text-blue-700 h-10 flex justify-center items-center mt-2 lg:mx-auto">
            <p className="bg-inherit">{isSuccess.data?.message}</p>
            <button
              className="w-5 absolute right-1"
              onClick={() => {
                setIsSuccess("");
              }}
            >
              <XMarkIcon />
            </button>
          </div>
        ) : clockOut ? (
          <div className="w-60 mx-auto rounded-md absolute top-5 right-7 bg-blue-200 text-blue-700 h-10 flex justify-center items-center mt-2 lg:mx-auto">
            <p className="bg-inherit">{clockOut}</p>
            <button
              className="w-5 absolute right-1"
              onClick={() => {
                setClockOut("");
              }}
            >
              <XMarkIcon />
            </button>
          </div>
        ) : null}
        {/* card */}
      </div>
      <div className="ml-5 py-2 flex justify-between lg:justify-start lg:gap-x-10">
        <Link to="/dashboard-employee">
          <div>
            <h1>Welcome,</h1>
            <h1 className="font-semibold text-xl">Usaid Aka</h1>
          </div>
        </Link>
        <div className="mt-2 bg-red-500 h-fit px-2 mr-3 rounded-md text-white">
          <button onClick={handleLogOut}>log out</button>
        </div>
      </div>
      <hr className="mx-3 bg-gray-200 h-1 rounded-2xl" />
      <div className="flex justify-evenly items-center lg:justify-between lg:ml-10">
        <div className="hidden lg:flex w-[450px] justify-between ">
          <div className="w-28 h-20 bg-blue-500 flex flex-col justify-center items-start text-sm pl-2 text-white rounded-lg lg:h-16 lg:my-2 lg:w-44">
            <h1>Absent entry </h1>
            {attendance.clock_in === null ? (
              <h1>you are not clocked in yet</h1>
            ) : (
              <h1>{attendance.clock_in}</h1>
            )}
          </div>
          <div className="w-28 h-20 bg-green-500 flex flex-col justify-center items-start text-sm pl-2 text-white rounded-lg lg:h-16 lg:my-2 lg:w-44">
            <h1>Absent out </h1>
            {attendance.clock_out === null ? (
              <h1>you are not clocked out yet</h1>
            ) : (
              <h1>{attendance.clock_out}</h1>
            )}
          </div>
        </div>

        <button onClick={handleClockIn}>
          <div className="bg-blue-500 p-2 w-20 h-20 flex flex-col items-center rounded-2xl text-white my-3 lg:w-32 lg:absolute lg:top-20 lg:h-32 lg:justify-center lg:right-[500px]">
            <h1 className="text-xs">Clock in</h1>
            <BoltIcon className="w-16" />
          </div>
        </button>

        <div>
          <button onClick={handleClockOut}>
            <div className="bg-red-500 p-2 w-20 h-20 flex flex-col items-center rounded-2xl text-white my-3 lg:w-32 lg:absolute lg:top-20 lg:h-32 lg:justify-center lg:right-72">
              <h1 className="text-xs">Clock out</h1>
              <BoltSlashIcon className="w-16" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardClock;
