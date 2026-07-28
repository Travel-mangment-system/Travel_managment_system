// import React from "react";
// import { Routes, Route } from "react-router-dom";

// // Layouts & Protected Routes
// import ProtectedRoute from "./ProtectedRoutes";

// // Auth Pages
// import Login from "../pages/Auth/Login";
// import Register from "../pages/Auth/Register";

// // Customer Bus Booking Pages
// import BusSearch from "../pages/Bus/BusSearch";
// <<<<<<< HEAD
// import StopSelection from "../pages/Bus/StopSelection";
// import SeatSelection from "../pages/Bus/SeatSelection";
// import PassengerDetails from "../pages/Bus/PassengerDetails";
// import Payment from "../pages/Bus/Payment";
// import MyBookings from "../pages/Bus/MyBookings"; // 👈 Import My Bookings page

// // Provider Pages
// import Dashboard from "../pages/Provider/Dashboard";
// import MyBuses from "../pages/Provider/MyBuses";
// import AddBus from "../pages/Provider/AddBus";
// import ScheduleBus from "../pages/Provider/ScheduleBus";

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public Auth Routes */}
//       <Route path="/" element={<Login />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* ================================================== */}
//       {/* 🔒 PROTECTED PROVIDER ROUTES                       */}
//       {/* ================================================== */}
//       <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
//         <Route path="/provider/dashboard" element={<Dashboard />} />
//         <Route path="/provider/buses" element={<MyBuses />} />
//         <Route path="/provider/buses/add" element={<AddBus />} />
//         <Route path="/provider/trips/schedule" element={<ScheduleBus />} />
//       </Route>

//       {/* ================================================== */}
//       {/* 🔒 PROTECTED CUSTOMER ROUTES                       */}
//       {/* ================================================== */}
//       <Route element={<ProtectedRoute allowedRoles={["CUSTOMER", "USER"]} />}>
//         {/* Customer Dashboard / Bookings Panel */}
//         <Route path="/my-bookings" element={<MyBookings />} />

//         {/* Bus Booking Flow */}
//         <Route path="/buses" element={<BusSearch />} />
//         <Route path="/buses/:busId/stops" element={<StopSelection />} />
//         <Route path="/buses/:busId/seats" element={<SeatSelection />} />
//         <Route
//           path="/buses/:busId/passenger-details"
//           element={<PassengerDetails />}
//         />
//         <Route path="/buses/:busId/payment" element={<Payment />} />
//       </Route>
//     </Routes>
//   );
// =======
// import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
// import ManageBusesPage from "../pages/Admin/ManageBusesPage";
// import AddPackage from "../pages/Admin/Packages/AddPackage";
// import Dashboard from "../pages/Admin/Dashboard";
// import PackageBookingPage from "../pages/PackageBooking/PackageBookingPage";
// import BookingSummaryPage from "../pages/PackageBooking/BookingSummaryPage";
// import BookingConfirmedPage from "../pages/PackageBooking/BookingConfirmedPage";
// import MyPackageBookingsPage from '../pages/PackageBooking/MyPackageBookingsPage';

// function AppRoutes() {
//     return (
//         <Routes>
//             {/* Auth Routes */}
//             <Route path="/" element={<Login />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Bus Routes */}
//             <Route path="/buses" element={<BusSearch />} />

//             {/* Package & Booking Routes */}
//             <Route path="/packages" element={<BrowsePackagesPage />} />
//             <Route path="/admin/add-package" element={<AddPackage />} />
//             <Route path="/package-booking" element={<PackageBookingPage />} />
//             <Route path="/booking-summary/:bookingId" element={<BookingSummaryPage />} />
//             <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
//             <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />

//             {/* Bus Management */}
//             <Route path="/manage-buses" element={<ManageBusesPage />} />

//             {/* Dashboard */}
//             <Route path="/Admin-Dashboard" element={<Dashboard />} />
//         </Routes>
//     );
// >>>>>>> 1b6c9060d52d288eb358a0d0c54e7618aebe0fd5
// }

// export default AppRoutes;

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
import MyBookings from "../pages/Bus/MyBookings";

// Provider Pages
import Dashboard from "../pages/Provider/Dashboard";
import MyBuses from "../pages/Provider/MyBuses";
import AddBus from "../pages/Provider/AddBus";
import ScheduleBus from "../pages/Provider/ScheduleBus";

// Friend's Admin & Package Booking Pages
import BrowsePackagesPage from "../pages/Admin/BrowsePackagesPage";
import ManageBusesPage from "../pages/Admin/ManageBusesPage";
import AddPackage from "../pages/Admin/Packages/AddPackage";
import AdminDashboard from "../pages/Admin/Dashboard"; // Renamed to avoid naming collision with Provider Dashboard
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
      {/* 🔒 PROTECTED PROVIDER ROUTES (Your Code)           */}
      {/* ================================================== */}
      <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
        <Route path="/provider/dashboard" element={<Dashboard />} />
        <Route path="/provider/buses" element={<MyBuses />} />
        <Route path="/provider/buses/add" element={<AddBus />} />
        <Route path="/provider/trips/schedule" element={<ScheduleBus />} />
      </Route>

      {/* ================================================== */}
      {/* 🔒 PROTECTED CUSTOMER ROUTES (Your Code)           */}
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

      {/* ================================================== */}
      {/* 📦 PACKAGE & ADMIN ROUTES (Friend's Code)          */}
      {/* ================================================== */}
      <Route path="/packages" element={<BrowsePackagesPage />} />
      <Route path="/admin/add-package" element={<AddPackage />} />
      <Route path="/package-booking" element={<PackageBookingPage />} />
      <Route
        path="/booking-summary/:bookingId"
        element={<BookingSummaryPage />}
      />
      <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
      <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />

      {/* Bus Management & Admin Dashboard */}
      <Route path="/manage-buses" element={<ManageBusesPage />} />
      <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;
