import { Link } from "react-router-dom";
import loggedIn from "./assets/loggedIn.png";
import { useEffect, useState } from "react";
import axios from "./api/axios";

function withOutAuth(Component) {
  return (props) => {
    const token = localStorage.getItem("token");
    const [userRole, setUserRole] = useState({});
    useEffect(() => {
      axios
        .get("/auth/user-information", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserRole(res.data?.data?.role_id));
    }, [token]);

    if (token) {
      return (
        <>
          <div className="w-full h-[550px]">
            <div className="h-full flex flex-col justify-center items-center ">
              <h1 className="font-semibold text-white">You are logged in</h1>
              <img src={loggedIn} alt="" className="lg:w-96" />
              <div className="flex gap-10">
                <button className="bg-blue-500 h-7 w-20 rounded-lg drop-shadow-lg">
                  <Link
                    className="bg-inherit text-white"
                    to={`${
                      userRole === 1
                        ? "/dashboard-admin"
                        : "/dashboard-employee"
                    }`}
                  >
                    go
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
    return <Component {...props} />;
  };
}

export default withOutAuth;
