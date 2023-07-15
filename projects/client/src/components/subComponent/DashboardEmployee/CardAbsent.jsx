import React from "react";

const CardAbsent = () => {
  return (
    <div className="flex justify-between w-64 mt-5 lg:hidden">
      <div className="w-28 h-20 bg-blue-500 flex flex-col justify-center items-start text-sm pl-2 text-white rounded-lg">
        <h1>Absent entry </h1>
        <h1>07:02:35</h1>
      </div>
      <div className="w-28 h-20 bg-green-500 flex flex-col justify-center items-start text-sm pl-2 text-white rounded-lg">
        <h1>Absent out </h1>
        <h1>17:32:21</h1>
      </div>
    </div>
  );
};

export default CardAbsent;
