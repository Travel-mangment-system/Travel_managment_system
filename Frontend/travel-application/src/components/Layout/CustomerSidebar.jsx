import {
    Home,
    ClipboardList,
    LogOut,
    Bus
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import "./CustomerSidebar.css";

const CustomerSidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {

        localStorage.clear();
        navigate("/login");

    };

    return (

        <aside className="customer-sidebar">

            <div className="sidebar-header">

                <Bus className="brand-icon" size={30} />

                <span className="brand-text">
                    TravelHub
                </span>

            </div>

            <div className="sidebar-title">
                MENU
            </div>

            <nav className="sidebar-nav">

                <a
                    href="#"
                    className={`nav-item ${
                        location.pathname === "/home"
                            ? "active"
                            : ""
                    }`}
                    onClick={(e) => {

                        e.preventDefault();
                        navigate("/home");

                    }}
                >

                    <Home size={20} />

                    Home

                </a>

                <a
                    href="#"
                    className={`nav-item ${
                        location.pathname === "/my-package-bookings"
                            ? "active"
                            : ""
                    }`}
                    onClick={(e) => {

                        e.preventDefault();
                        navigate("/my-package-bookings");

                    }}
                >

                    <ClipboardList size={20} />

                    My Package Bookings

                </a>

            </nav>

            <div className="sidebar-footer">

                <button
                    className="nav-item logout"
                    onClick={handleLogout}
                >

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>

    );

};

export default CustomerSidebar;