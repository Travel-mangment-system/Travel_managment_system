import React from "react";
import Sidebar from "../components/Layout/Sidebar";
import TopNavbar from "../components/Layout/TopNavbar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {

    return (

        <div className="admin-layout">

            <Sidebar />

            <main className="admin-main">

                <TopNavbar />

                <div className="admin-page-content">

                    {children}

                </div>

            </main>

        </div>

    );

};

export default AdminLayout;