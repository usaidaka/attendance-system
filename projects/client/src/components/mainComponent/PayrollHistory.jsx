import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CardClock from "../subComponent/DashboardEmployee/CardClock";
import { Link } from "react-router-dom";

const PayrollHistory = () => {
  const headings = ["No", "Date", "deduction", "payroll"];

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center ">
        <CardClock />
        <div>
          <div className="flex justify-between w-64 mt-5 h-7 bg-green-payroll rounded-xl lg:w-[900px] lg:h-[50px]">
            <div className="flex justify-between w-full items-center mx-3 my-2">
              <h1 className="font-semibold text-white text-xs lg:text-xl">
                Payroll recapitulation
              </h1>
              <CurrencyDollarIcon className="w-6 lg:w-12" />
            </div>
          </div>

          <div>
            <div className="flex flex-col text-xs mt-1 lg:text-base">
              <label htmlFor="">From</label>
              <input type="date" name="" id="" />
              <label htmlFor="">To</label>
              <input type="date" name="" id="" />
            </div>
            <div className=" mt-3 mb-16 lg:mb-2">
              <table className="w-full rounded-md bg-white">
                <thead>
                  <tr className="text-sm">
                    {headings.map((heading, index) => (
                      <th className="" key={index}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-xs text-center h-8">
                    <td>1</td>
                    <td>2016-07-11</td>
                    <td>07:05:28</td>
                    <td>17:23:28</td>
                  </tr>
                  <tr className="text-xs text-center h-8">
                    <td>2</td>
                    <td>2016-07-11</td>
                    <td>07:05:28</td>
                    <td>17:23:28</td>
                  </tr>
                  <tr className="text-xs text-center h-8">
                    <td>3</td>
                    <td>2016-07-11</td>
                    <td>07:05:28</td>
                    <td>17:23:28</td>
                  </tr>
                  <tr className="text-xs text-center h-8">
                    <td>4</td>
                    <td>2016-07-11</td>
                    <td>07:05:28</td>
                    <td>17:23:28</td>
                  </tr>
                  <tr className="text-xs text-center h-8">
                    <td>5</td>
                    <td>2016-07-11</td>
                    <td>07:05:28</td>
                    <td>17:23:28</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-center mt-2">
                <ArrowLeftCircleIcon className="w-10" />
                <ArrowRightCircleIcon className="w-10" />
              </div>
            </div>
            <div>
              <span className="hidden lg:inline">next page</span>
              <Link to="/absent-history">
                <div className="hidden lg:flex justify-between w-64 bg-blue-absent-history rounded-xl lg:w-[900px] lg:h-[60px]">
                  <div className="flex justify-between w-full items-center mx-3 my-2">
                    <h1 className="font-semibold text-white">Absent history</h1>
                    <ClockIcon className="w-16" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollHistory;
