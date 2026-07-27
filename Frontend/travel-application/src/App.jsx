import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import AppLayout from "./layouts/AppLayout";
import BusSearch from "./pages/Bus/BusSearch";
import StopSelection from "./pages/Bus/StopSelection";
import SeatSelection from "./pages/Bus/SeatSelection";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Include your standard global routes */}
        <Route path="/*" element={<AppRoutes />} />

        {/* Bus specific layout flows introduced by Vaishnav */}
        <Route element={<AppLayout />}>
          <Route path="/buses" element={<BusSearch />} />
          <Route path="/buses/:busId/stops" element={<StopSelection />} />
          <Route path="/buses/:busId/seats" element={<SeatSelection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;