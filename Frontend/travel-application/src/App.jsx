import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./pages/HomePage/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays fixed at the top and has access to router context */}
      <Navbar />

      {/* All page routing is handled cleanly inside AppRoutes */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;