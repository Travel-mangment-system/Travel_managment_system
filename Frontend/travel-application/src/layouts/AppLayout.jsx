import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* Fixed Sidebar on the left */}
      <Sidebar />

      {/* Main content area on the right */}
      <div className="main-content">
        {/* <Outlet /> renders whatever page the route matches (e.g., BusSearch, StopSelection) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
