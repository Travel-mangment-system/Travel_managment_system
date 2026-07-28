import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Bus & Admin Pages
import BusSearch from "../pages/Bus/BusSearch";
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
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

      {/* Bus & Admin Routes */}
      <Route path="/buses" element={<BusSearch />} />
      <Route path="/packages" element={<BrowsePackagesPage />} />
      <Route path="/manage-buses" element={<ManageBusesPage />} />
      <Route path="/Admin-Dashboard" element={<Dashboard/>} />
      <Route path="/package-booking" element={<PackageBookingPage/>} />
      <Route path="//booking-summary/:bookingId" element={<BookingSummaryPage/>} />
      <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
      <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />
    </Routes>
  );
}

export default AppRoutes;