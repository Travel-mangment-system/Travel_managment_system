import { Routes, Route } from "react-router-dom";
import PackageDetails from "../pages/Customer/PackageDetails";
// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Home Page
import HomePage from "../pages/Home/HomePage";

// Bus Pages
import BusSearch from "../pages/Bus/BusSearch";

// Admin Pages
import Dashboard from "../pages/Admin/Dashboard";
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
import AddPackage from "../pages/Admin/Packages/AddPackage";

// Package Booking Pages
import PackageBookingPage from "../pages/PackageBooking/PackageBookingPage";
import BookingSummaryPage from "../pages/PackageBooking/BookingSummaryPage";
import BookingConfirmedPage from "../pages/PackageBooking/BookingConfirmedPage";
import MyPackageBookingsPage from "../pages/PackageBooking/MyPackageBookingsPage";

function AppRoutes() {
    return (
        <Routes>

            {/* ========================= */}
            {/* Authentication */}
            {/* ========================= */}

            {/* Default Route */}
            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* ========================= */}
            {/* Customer Home */}
            {/* ========================= */}

            <Route path="/home" element={<HomePage />} />

            {/* ========================= */}
            {/* Bus */}
            {/* ========================= */}

            <Route path="/buses" element={<BusSearch />} />

            {/* ========================= */}
            {/* Packages */}
            {/* ========================= */}

            <Route path="/packages" element={<BrowsePackagesPage />} />

            <Route
                path="/package-booking"
                element={<PackageBookingPage />}
            />

            <Route
                path="/booking-summary/:bookingId"
                element={<BookingSummaryPage />}
            />

            <Route
                path="/booking-confirmed"
                element={<BookingConfirmedPage />}
            />

            <Route
                path="/my-package-bookings"
                element={<MyPackageBookingsPage />}
            />

            {/* ========================= */}
            {/* Admin */}
            {/* ========================= */}

            <Route
                path="/Admin-Dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/admin/add-package"
                element={<AddPackage />}
            />

            <Route
                path="/manage-buses"
                element={<ManageBusesPage />}
            />

            {/* ========================= */}
            {/* Optional Provider */}
            {/* Uncomment when Provider page exists */}
            {/*
            <Route
                path="/provider-dashboard"
                element={<ProviderDashboard />}
            />
            */}
            <Route
                path="/package-details/:packageId"
                element={<PackageDetails />}
            />

        </Routes>
    );
}

export default AppRoutes;