import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Bus & Admin Pages & Layouts
import BusSearch from "../pages/Bus/BusSearch";
import StopSelection from "../pages/Bus/StopSelection";
import SeatSelection from "../pages/Bus/SeatSelection";
import AppLayout from "../layouts/AppLayout";
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

      {/* Bus specific layout flows */}
      <Route element={<AppLayout />}>
        <Route path="/buses" element={<BusSearch />} />
        <Route path="/buses/:busId/stops" element={<StopSelection />} />
        <Route path="/buses/:busId/seats" element={<SeatSelection />} />
      </Route>

      {/* Admin & Package Routes */}
      <Route path="/packages" element={<BrowsePackagesPage />} />
      <Route path="/manage-buses" element={<ManageBusesPage />} />
    </Routes>
  );
};

export default AppRoutes;