import React from "react";
import admin from "../../assets/dashboard-admin.png";
import { Link, useNavigate } from "react-router-dom";

const DashBoardAdmin = () => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    navigate("/");
    localStorage.removeItem("token");
  };

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold text-white text-3xl">Hi, My admin!</h1>
        <h1 className="font-bold text-white ">Have a great day</h1>
      </div>
      <div>
        <img src={admin} alt="" />
      </div>
      <div className="flex text-white flex-col gap-3 w-56 justify-center">
        <button className="bg-blue-button py-1 rounded-md">
          <Link to="/register-employee">Enroll New Employee </Link>
        </button>
        <button className="bg-red-500 py-1 rounded-md" onClick={handleLogOut}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default DashBoardAdmin;
