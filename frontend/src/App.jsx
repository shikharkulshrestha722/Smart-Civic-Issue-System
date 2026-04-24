import { useState } from "react";

import Login from "./pages/auth/Login";;
import UserDashboard from "./pages/User/Dashboard";
import Report from "./pages/User/Report";
import Tracking from "./pages/User/Tracking";
import Employee from "./pages/Employee/Dashboard";
import Admin from "./pages/Admin/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  // page = { type: "dashboard" | "report" | "tracking", dept?: string }
  const [page, setPage] = useState({ type: "dashboard" });

  // 🔐 LOGIN
  if (!user) return <Login setUser={setUser} />;

  // 👤 USER FLOW
  if (user.role === "user") {
    if (page.type === "dashboard") {
      return <UserDashboard setPage={setPage} />;
    }

    if (page.type === "report") {
      return (
        <Report
          dept={page.dept}
          user={user}
          setPage={setPage}
        />
      );
    }

    if (page.type === "tracking") {
      return <Tracking setPage={setPage} />;
    }
  }

  // 👷 EMPLOYEE
  if (user.role === "employee") {
  return <Employee user={user} setUser={setUser} />;
}

if (user.role === "admin") {
  return <Admin setUser={setUser} />;
}

  return null;
}

export default App;
