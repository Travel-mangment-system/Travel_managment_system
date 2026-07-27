import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Bus & Admin Pages
import BusSearch from "../pages/Bus/BusSearch";
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Bus & Admin Routes */}
      <Route path="/buses" element={<BusSearch />} />
      <Route path="/packages" element={<BrowsePackagesPage />} />
      <Route path="/manage-buses" element={<ManageBusesPage />} />
    </Routes>
  );
};

export default AppRoutes;