import React from "react";
import withAuth from "../../withAuth";
import payroll from "../../assets/payroll.png";
import Clock from "../subComponent/globalComponentAsset/Clock";
import ModalPayroll from "./ModalPayroll";
import { Link } from "react-router-dom";

const PayEmployeeByAdmin = () => {
  return (
    <div>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="bg-white w-52 rounded-lg flex flex-col justify-center items-center ">
          <Clock />
        </div>
        <img src={payroll} alt="" className="w-60 mt-5" />
        <div className="text-center text-sm font-bold mt-5">
          <h1>Please, Make sure </h1>
          <h1>the Employee should paid on this Date </h1>
        </div>
        <ModalPayroll />
        <button className="bg-blue-button w-64 text-white px-3 py-1 mt-2 rounded-md">
          <Link to="/dashboard-admin">Back to dashboard</Link>
        </button>
      </div>
    </div>
  );
};

export default withAuth(PayEmployeeByAdmin);
