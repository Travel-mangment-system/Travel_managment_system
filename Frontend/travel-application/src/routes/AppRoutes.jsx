import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts & Protected Routes
import ProtectedRoute from "./ProtectedRoutes";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Customer Bus Booking Pages
import BusSearch from "../pages/Bus/BusSearch";
import StopSelection from "../pages/Bus/StopSelection";
import SeatSelection from "../pages/Bus/SeatSelection";
import PassengerDetails from "../pages/Bus/PassengerDetails";
import Payment from "../pages/Bus/Payment";
import MyBookings from "../pages/Bus/MyBookings"; // 👈 Import My Bookings page

// Provider Pages
import Dashboard from "../pages/Provider/Dashboard";
import MyBuses from "../pages/Provider/MyBuses";
import AddBus from "../pages/Provider/AddBus";
import ScheduleBus from "../pages/Provider/ScheduleBus";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
      </Route>
    </Routes>
  );
}

export default AppRoutes;
