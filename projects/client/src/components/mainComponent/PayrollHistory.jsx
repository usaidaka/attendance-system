import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Pagination } from "flowbite-react";

import CardClock from "../subComponent/DashboardEmployee/CardClock";
import axios from "../../api/axios";

const headings = ["No", "Date", "deduction", "payroll"];
const PayrollHistory = () => {
  const token = localStorage.getItem("token");
  const [payrolls, setPayrolls] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const currentDate = dayjs();
    const formattedStart = currentDate.subtract(5, "day").format("YYYY-MM-DD");
    return formattedStart;
  });
  const [endDate, setEndDate] = useState(() => {
    const currentDate = dayjs();
    const formattedEnd = currentDate.format("YYYY-MM-DD");
    return formattedEnd;
  });

  useEffect(() => {
    axios
      .get("/payroll", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPayrolls(res.data?.data));
  }, [token]);

  const buttonFilterPayroll = (e) => {
    e.preventDefault();
    const queryParams = {};

    if (startDate) {
      queryParams.startDate = dayjs(startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    }
    if (endDate) {
      queryParams.endDate = dayjs(endDate)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    }
    const queryString = Object.keys(queryParams)
      .map((key) => key + "=" + queryParams[key])
      .join("&");

    axios
      .get(`/payroll?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPayrolls(response.data?.data);
      })
      .catch((err) => console.log(err));
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(`/payroll?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const {
        data: { data, currentPage, totalPages },
      } = response;
      setPayrolls(data);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!payrolls) {
    return <p></p>;
  }

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
              <input
                type="date"
                name=""
                id=""
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label htmlFor="">To</label>
              <input
                type="date"
                name=""
                id=""
                onChange={(e) => setEndDate(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={buttonFilterPayroll}
                  className="bg-blue-button rounded-md text-white w-20 h-6 text-xs"
                >
                  go
                </button>
              </div>
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
                  {payrolls.map((payroll, index) => (
                    <tr className="text-xs text-center h-8">
                      <td>{index + 1}</td>
                      <td>
                        {dayjs(payroll.date.split("T")[0]).format("MM/DD/YYYY")}
                      </td>
                      <td>{payroll.deduction}</td>
                      <td>{payroll.payroll}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex text-xs justify-center items-center ">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  color="blue"
                  showIcons
                  layout="navigation"
                  rounded="true"
                />
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
