import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusSearch from "./pages/Bus/BusSearch";
import BrowsePackagesPage from "./pages/Admin/BrowsePackagesPage"; // Updated import name
import ManageBusesPage from "./pages/Admin/ManageBusesPage";
function App() {
  return (
    <Routes>
      {/* Redirect root to buses */}
      <Route path="/" element={<Navigate to="/buses" replace />} />

      {/* Your bus search page */}
      <Route path="/buses" element={<BusSearch />} />

      {/* Route for the Customer Packages Page */}
      <Route path="/packages" element={<BrowsePackagesPage />} />

      <Route path="/manage-buses" element={<ManageBusesPage />} />
    </Routes>
  );
}

export default App;