import { Link } from "react-router-dom";
import needAuth from "./assets/withAuth.png";
import { useEffect, useState } from "react";
import axios from "./api/axios";

function withAuth(Component) {
  return (props) => {
    const token = localStorage.getItem("token");
    if (token) {
      return <Component {...props} />;
    }
    return (
      <>
        <div className="w-full h-[550px]">
          <div className="h-full flex flex-col justify-center items-center ">
            <h1 className="font-semibold text-white">You need to log in</h1>
            <img src={needAuth} alt="" className="lg:w-96" />
            <div className="flex gap-10">
              <button className="bg-blue-500 h-7 w-20 rounded-lg drop-shadow-lg">
                <Link className="bg-inherit text-white" to="/">
                  Log in
                </Link>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
}

export default withAuth;
