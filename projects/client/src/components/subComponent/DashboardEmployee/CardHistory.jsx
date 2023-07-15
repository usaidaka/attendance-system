import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

const CardHistory = () => {
  return (
    <div>
      <Link to="/absent-history">
        <div className="flex justify-between w-64 mt-5  bg-blue-absent-history rounded-xl lg:w-[900px] lg:h-[120px]">
          <div className="flex justify-between w-full items-center mx-3 my-2">
            <h1 className="font-semibold text-white">Absent history</h1>
            <ClockIcon className="w-16" />
          </div>
        </div>
      </Link>
      <Link to="/payroll-history">
        <div className="flex justify-between w-64 mt-5  bg-green-payroll rounded-xl lg:w-[900px] lg:h-[120px]">
          <div className="flex justify-between w-full items-center mx-3 my-2">
            <h1 className="font-semibold text-white">
              Payroll <br />
              recapitulation
            </h1>
            <CurrencyDollarIcon className="w-16" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardHistory;
