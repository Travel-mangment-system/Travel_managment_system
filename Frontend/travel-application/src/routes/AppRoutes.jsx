import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Bus & Admin Pages
import BusSearch from "../pages/Bus/BusSearch";
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
import AddPackage from "../pages/Admin/Packages/AddPackage";
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

            {/* Bus Routes */}
            <Route path="/buses" element={<BusSearch />} />

            {/* Package & Booking Routes */}
            <Route path="/packages" element={<BrowsePackagesPage />} />
            <Route path="/admin/add-package" element={<AddPackage />} />
            <Route path="/package-booking" element={<PackageBookingPage />} />
            <Route path="/booking-summary/:bookingId" element={<BookingSummaryPage />} />
            <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
            <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />

            {/* Bus Management */}
            <Route path="/manage-buses" element={<ManageBusesPage />} />

            {/* Dashboard */}
            <Route path="/Admin-Dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default AppRoutes;