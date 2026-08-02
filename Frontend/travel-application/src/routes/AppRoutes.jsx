import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts & Protected Routes
import ProtectedRoute from "./ProtectedRoutes";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Customer Home & Package Details
import HomePage from "../pages/Home/HomePage";
import PackageDetails from "../pages/Customer/PackageDetails";

// Customer Bus Booking Pages
import BusSearch from "../pages/Bus/BusSearch";
import StopSelection from "../pages/Bus/StopSelection";
import SeatSelection from "../pages/Bus/SeatSelection";
import PassengerDetails from "../pages/Bus/PassengerDetails";
import Payment from "../pages/Bus/Payment";
import MyBookings from "../pages/Bus/MyBookings";
import BookingSuccess from "../pages/Bus/BookingSuccess";

// Provider Pages
import Dashboard from "../pages/Provider/Dashboard";
import MyBuses from "../pages/Provider/MyBuses";
import AddBus from "../pages/Provider/AddBus";
import ScheduleBus from "../pages/Provider/ScheduleBus";

// Admin & Package Booking Pages
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
import AddPackage from "../pages/Admin/Packages/AddPackage";
import AdminDashboard from "../pages/Admin/Dashboard";
import RoutePage from "../pages/Admin/Routes/RoutePage";
import CitiesPage from "../pages/Admin/Cities/CitiesPage";
import BusStops from "../pages/Admin/BusStops/BusStops";

import PackageBookingPage from "../pages/PackageBooking/PackageBookingPage";
import BookingSummaryPage from "../pages/PackageBooking/BookingSummaryPage";
import BookingConfirmedPage from "../pages/PackageBooking/BookingConfirmedPage";
import MyPackageBookingsPage from "../pages/PackageBooking/MyPackageBookingsPage";

function AppRoutes() {
  return (
    <Routes>
      {/* ================================================== */}
      {/* 🔓 PUBLIC AUTHENTICATION ROUTES                    */}
      {/* ================================================== */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================================================== */}
      {/* 🏡 CUSTOMER HOME PAGE                              */}
      {/* ================================================== */}
      <Route path="/home" element={<HomePage />} />

      {/* ================================================== */}
      {/* 🔒 PROTECTED PROVIDER ROUTES                       */}
      {/* ================================================== */}
      <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
        <Route path="/provider/dashboard" element={<Dashboard />} />
        <Route path="/provider/buses" element={<MyBuses />} />
        <Route path="/provider/buses/add" element={<AddBus />} />
        <Route path="/provider/trips/schedule" element={<ScheduleBus />} />
      </Route>

      {/* ================================================== */}
      {/* 🔒 PROTECTED CUSTOMER ROUTES                       */}
      {/* ================================================== */}
      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER", "USER"]} />}>
        {/* Customer Dashboard / Bookings Panel */}
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Bus Booking Flow */}
        <Route path="/buses" element={<BusSearch />} />
        <Route path="/buses/:busId/stops" element={<StopSelection />} />
        <Route path="/buses/:busId/seats" element={<SeatSelection />} />
        <Route
          path="/buses/:busId/passenger-details"
          element={<PassengerDetails />}
        />
        <Route path="/buses/:busId/payment" element={<Payment />} />

        {/* Bus Booking Confirmation */}
        <Route path="/buses/:busId/confirmation" element={<BookingSuccess />} />
      </Route>

      {/* ================================================== */}
      {/* 📦 PACKAGE & BOOKING ROUTES                        */}
      {/* ================================================== */}
      <Route path="/packages" element={<BrowsePackagesPage />} />
      <Route path="/package-details/:packageId" element={<PackageDetails />} />
      <Route path="/package-booking" element={<PackageBookingPage />} />
      <Route
        path="/booking-summary/:bookingId"
        element={<BookingSummaryPage />}
      />
      <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
      <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />

      {/* ================================================== */}
      {/* ⚙️ ADMIN & MANAGEMENT ROUTES                       */}
      {/* ================================================== */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/add-package" element={<AddPackage />} />
        <Route path="/manage-buses" element={<ManageBusesPage />} />
        <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
        <Route path="/admin/routes" element={<RoutePage />} />
        <Route path="/admin/cities" element={<CitiesPage />} />
        <Route path="/admin/stops" element={<BusStops />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;