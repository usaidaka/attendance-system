import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/mainComponent/Login";
import RegisterEmployee from "./components/mainComponent/RegisterEmployee";
import DashboardEmployee from "./components/mainComponent/DashboardEmployee";
import DashBoardAdmin from "./components/mainComponent/DashboardAdmin";
import UpdateEmployee from "./components/mainComponent/UpdateEmployee";
import FooterMobile from "./components/mainComponent/FooterMobile";
import AbsentHistory from "./components/mainComponent/AbsentHistory";
import PayrollHistory from "./components/mainComponent/PayrollHistory";
import PayEmployeeByAdmin from "./components/mainComponent/PayEmployeeByAdmin";

function App() {
  return (
    <Router>
      <div className="App w-full h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-employee" element={<RegisterEmployee />} />
          <Route path="/dashboard-admin" element={<DashBoardAdmin />} />
          <Route path="/dashboard-employee" element={<DashboardEmployee />} />
          <Route path="/update-employee/:token" element={<UpdateEmployee />} />
          <Route path="/absent-history" element={<AbsentHistory />} />
          <Route path="/payroll-history" element={<PayrollHistory />} />
          <Route path="/pay-employee" element={<PayEmployeeByAdmin />} />
        </Routes>
      </div>
      <FooterMobile />
    </Router>
  );
}

export default App;
