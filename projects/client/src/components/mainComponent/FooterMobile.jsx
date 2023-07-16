import {
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../../api/axios";

const FooterMobile = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/auth/user-information", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserRole(res.data?.data?.role_id));
  }, [token]);

  return (
    <div
      className={`${
        token && userRole === 2 ? "fixed" : "hidden"
      } bottom-0 lg:hidden `}
    >
      <div className="bg-pink-footer w-screen h-12 flex justify-around items-center lg:hidden">
        <div
          className={`bg-inherit ${
            location.pathname === "/dashboard-employee"
              ? "text-black"
              : "text-white"
          } col-span-1`}
        >
          <Link
            to="/dashboard-employee"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <HomeIcon className="w-6 mt-1 bg-inherit" />
            <h1 className="bg-inherit text-xs ">Home</h1>
          </Link>
        </div>

        <div
          className={`bg-inherit ${
            location.pathname === "/absent-history"
              ? "text-black"
              : "text-white"
          } col-span-1`}
        >
          <Link
            to="/absent-history"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <ClockIcon className="w-6 mt-1 bg-inherit" />
            <h1 className="bg-inherit text-xs ">Absent</h1>
          </Link>
        </div>
        <div
          className={`bg-inherit ${
            location.pathname === "/payroll-history"
              ? "text-black"
              : "text-white"
          } col-span-1`}
        >
          <Link
            to="/payroll-history"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <CurrencyDollarIcon className="w-6 mt-1 bg-inherit" />
            <h1 className="bg-inherit text-xs ">Payroll</h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterMobile;
