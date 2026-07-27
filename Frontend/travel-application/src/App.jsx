import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import BusSearch from "./pages/Bus/BusSearch";
import StopSelection from "./pages/Bus/StopSelection";
import SeatSelection from "./pages/Bus/SeatSelection";

function App() {
  return (
    <Routes>
      {/* Any route placed inside this AppLayout block will automatically have the Sidebar! */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/buses" replace />} />
        <Route path="/buses" element={<BusSearch />} />
        <Route path="/buses/:busId/stops" element={<StopSelection />} />
        <Route path="/buses/:busId/seats" element={<SeatSelection />} />
      </Route>

      {/* Note: If you have a Login page later, you can put it OUTSIDE the <Route element={<AppLayout />}> so it doesn't have a sidebar! */}
    </Routes>
  );
}

export default App;
