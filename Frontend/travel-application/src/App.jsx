import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusSearch from "./pages/Bus/BusSearch";

function App() {
  return (
    <Routes>
      {/* This tells React: If the user visits "/", redirect them to "/buses" automatically */}
      <Route path="/" element={<Navigate to="/buses" replace />} />

      {/* Your actual bus search page */}
      <Route path="/buses" element={<BusSearch />} />
    </Routes>
  );
}

export default App;
