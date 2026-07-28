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
<<<<<<< HEAD

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
=======
import Dashboard from "../pages/Admin/Dashboard";
import PackageBookingPage from "../pages/PackageBooking/PackageBookingPage";
import BookingSummaryPage from "../pages/PackageBooking/BookingSummaryPage";
import BookingConfirmedPage from "../pages/PackageBooking/BookingConfirmedPage";
import MyPackageBookingsPage from '../pages/PackageBooking/MyPackageBookingsPage';


function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
>>>>>>> 1b6c9060d52d288eb358a0d0c54e7618aebe0fd5


<<<<<<< HEAD
=======
            {/* Package & Booking Routes */}
            <Route path="/packages" element={<BrowsePackagesPage />} />
            <Route path="/admin/add-package" element={<AddPackage />} />
            <Route path="/package-booking" element={<PackageBookingPage />} />
            <Route path="/booking-summary/:bookingId" element={<BookingSummaryPage />} />
            <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
            <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />
>>>>>>> 1b6c9060d52d288eb358a0d0c54e7618aebe0fd5

      {/* =====================================================
          ADDED THIS COMPLETE BLOCK
          All customer pages will now use MainLayout.
          MainLayout already contains:
              <Navbar />
              <Outlet />

<<<<<<< HEAD
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
=======
            {/* Dashboard */}
            <Route path="/Admin-Dashboard" element={<Dashboard />} />
        </Routes>
    );
>>>>>>> 1b6c9060d52d288eb358a0d0c54e7618aebe0fd5
}

export default AppRoutes;