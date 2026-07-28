import { Bus, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {

        localStorage.clear();
        navigate("/login");

    };

    return (

        <aside className="sidebar">

            <div className="sidebar-header">

                <Bus className="brand-icon" size={32} />

                <span className="brand-text">

                    TravelHub

                </span>

            </div>

            <div className="sidebar-title">

                Admin Panel

            </div>

            <nav className="sidebar-nav">

                <a
                    href="#"
                    className={`nav-item ${location.pathname === "/Admin-Dashboard" ? "active" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/Admin-Dashboard");
                    }}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </a>

                <a
                    href="#"
                    className="nav-item"
                >
                    <Users size={20} />
                    Users
                </a>

                <a
                    href="#"
                    className="nav-item"
                >
                    <Bus size={20} />
                    Bus Providers
                </a>

                <a
                    href="#"
                    className={`nav-item ${location.pathname === "/manage-buses" ? "active" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/manage-buses");
                    }}
                >
                    <Bus size={20} />
                    Manage Buses
                </a>

                <a
                    href="#"
                    className={`nav-item ${location.pathname === "/packages" ? "active" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/packages");
                    }}
                >
                    <Bus size={20} />
                    Packages
                </a>

                <a
                    href="#"
                    className={`nav-item ${location.pathname === "/admin/add-package" ? "active" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/admin/add-package");
                    }}
                >
                    <Bus size={20} />
                    Add Package
                </a>

            </nav>

            <div className="sidebar-footer">

                <a
                    href="#"
                    className="nav-item"
                >
                    <Settings size={20} />
                    Settings
                </a>

                <button
                    className="nav-item logout"
                    onClick={handleLogout}
                    style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                        cursor: "pointer"
                    }}
                >

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>

    );

};

export default Sidebar;