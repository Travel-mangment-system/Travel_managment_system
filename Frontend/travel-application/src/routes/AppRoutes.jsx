import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Bus & Admin Pages
import BusSearch from "../pages/Bus/BusSearch";
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
import Dashboard from "../pages/Admin/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Bus & Admin Routes */}
      <Route path="/buses" element={<BusSearch />} />
      <Route path="/packages" element={<BrowsePackagesPage />} />
      <Route path="/manage-buses" element={<ManageBusesPage />} />
      <Route path="/Admin-Dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default AppRoutes;