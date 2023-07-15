import React, { useEffect, useState } from "react";
import CardClock from "../subComponent/DashboardEmployee/CardClock";
import { Link } from "react-router-dom";
import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { Pagination } from "flowbite-react";
import axios from "../../api/axios";

const headings = ["No", "Date", "Clock in", "Clock Out"];

const AbsentHistory = () => {
  const token = localStorage.getItem("token");
  const [absents, setAbsents] = useState([]);
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
      .get("/attendance/absent", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAbsents(res.data?.data));
  }, [token]);

  const buttonFilterBlog = (e) => {
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
      .get(`/attendance/absent?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAbsents(response.data?.data);
      })
      .catch((err) => console.log(err));
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(`/attendance/absent?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const {
        data: { data, currentPage, totalPages },
      } = response;
      setAbsents(data);
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

  if (!absents) {
    return <p></p>;
  }

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center ">
        <CardClock />
        <div>
          <div className="flex justify-between w-64 mt-5 h-7   bg-blue-absent-history rounded-xl lg:w-[900px] lg:h-[50px]">
            <div className="flex justify-between w-full items-center mx-3 my-2">
              <h1 className="font-semibold text-white text-xs lg:text-xl">
                Absent history
              </h1>
              <ClockIcon className="w-6 lg:w-12" />
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
                // value={startDate}
              />
              <label htmlFor="">To</label>
              <input
                type="date"
                name=""
                id=""
                onChange={(e) => setEndDate(e.target.value)}
                // value={endDate}
              />
              <div className="flex justify-end">
                <button
                  onClick={buttonFilterBlog}
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
                      <th key={index.toString()}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {absents.map((absent, index) => (
                    <tr className="text-xs text-center h-8">
                      <td>{index + 1}</td>
                      <td>
                        {dayjs(absent.date.split("T")[0]).format("MM/DD/YYYY")}
                      </td>
                      <td>
                        <span className="bg-blue-500 text-white px-2 rounded-full w-fit h-fit">
                          {absent.clock_in}
                        </span>
                      </td>
                      <td>
                        <span className=" bg-green-500 text-white px-2 rounded-full w-fit h-fit">
                          {absent.clock_out}
                        </span>
                      </td>
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
              <Link to="/payroll-history">
                <div className="hidden lg:flex justify-between w-64  bg-green-payroll rounded-xl lg:w-[900px] lg:h-[60px]">
                  <div className="flex justify-between w-full items-center mx-3 my-2">
                    <h1 className="font-semibold text-white">
                      Payroll recapitulation
                    </h1>
                    <CurrencyDollarIcon className="w-16" />
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

export default AbsentHistory;
