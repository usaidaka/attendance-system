import React from "react";
import CardClock from "../subComponent/DashboardEmployee/CardClock";
import CardAbsent from "../subComponent/DashboardEmployee/CardAbsent";
import CardHistory from "../subComponent/DashboardEmployee/CardHistory";
import withAuth from "../../withAuth";

const DashboardEmployee = () => {
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center ">
        <CardClock />
        <CardAbsent />
        <CardHistory />
      </div>
    </div>
  );
};

export default withAuth(DashboardEmployee);
