import { Routes, Route } from "react-router-dom";

// =======================
// Auth Pages
// =======================
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// =======================
// Customer Pages
// =======================
import HomePage from "../pages/Home/HomePage";
import BusSearch from "../pages/Bus/BusSearch";
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";

// =======================
// Admin Pages
// =======================
import Dashboard from "../pages/Admin/Dashboard";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
import AddPackage from "../pages/Admin/Packages/AddPackage";

// =======================
// Layout
// =======================

// ************* ADDED *************
// This layout automatically shows Navbar
// and renders the page inside <Outlet />
import MainLayout from "../Layouts/MainLayout";
// *********************************

function AppRoutes() {
  return (
    <Routes>

      {/* =======================
          Authentication Routes
      ======================== */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />



      {/* =====================================================
          ADDED THIS COMPLETE BLOCK
          All customer pages will now use MainLayout.
          MainLayout already contains:
              <Navbar />
              <Outlet />

          So Navbar will automatically appear on:
              /home
              /buses
              /packages
      ====================================================== */}
      <Route element={<MainLayout />}>

        {/* ************* ADDED *************
            This route was missing.
            Login.jsx does:
                navigate("/home")
            so this route is compulsory.
        ******************************** */}
        <Route path="/home" element={<HomePage />} />

        {/* MOVED INSIDE MainLayout */}
        <Route path="/buses" element={<BusSearch />} />

        {/* MOVED INSIDE MainLayout */}
        <Route path="/packages" element={<BrowsePackagesPage />} />

      </Route>
      {/* ===================================================== */}



      {/* =======================
          Admin Routes
      ======================== */}

      <Route path="/Admin-Dashboard" element={<Dashboard />} />

      <Route path="/manage-buses" element={<ManageBusesPage />} />

      <Route path="/admin/add-package" element={<AddPackage />} />

    </Routes>
  );
}

export default AppRoutes;