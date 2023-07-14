import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/mainComponent/Login";
import RegisterEmployee from "./components/mainComponent/RegisterEmployee";
import DashboardEmployee from "./components/mainComponent/DashboardEmployee";
import DashBoardAdmin from "./components/mainComponent/DashboardAdmin";
import UpdateEmployee from "./components/mainComponent/UpdateEmployee";

function App() {
  return (
    <Router>
      <div className="App w-full h-screen ">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-employee" element={<RegisterEmployee />} />
          <Route path="/dashboard-admin" element={<DashBoardAdmin />} />
          <Route path="/dashboard-employee" element={<DashboardEmployee />} />
          <Route path="/update-employee/:token" element={<UpdateEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
