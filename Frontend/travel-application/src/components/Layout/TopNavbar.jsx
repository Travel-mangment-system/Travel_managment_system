import React, { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TopNavbar.css";
const TopNavbar = () => {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        name: "Loading...",
        role: "",
        initials: ".."
    });

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            const payload = JSON.parse(atob(token.split(".")[1]));

            const rawName = payload.sub || "User";

            const displayName = rawName.includes("@")
                ? rawName.split("@")[0]
                : rawName;

            const role = (payload.user_role || "USER")
                .replace("ROLE_", "");

            const formattedRole =
                role.charAt(0).toUpperCase() +
                role.slice(1).toLowerCase();

            const initials =
                displayName.substring(0, 2).toUpperCase();

            setUserInfo({
                name: displayName,
                role: formattedRole,
                initials: initials
            });

        }
        catch {

            localStorage.clear();

            navigate("/login");

        }

    }, [navigate]);

    return (

        <header className="top-navbar">

            <div>

                <div className="search-bar">

                    <Search
                        className="search-icon"
                        size={20}
                    />

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                    />

                </div>

            </div>

            <div className="top-actions">

                <button className="btn-icon">

                    <Bell size={22} />

                </button>

                <div className="profile-section">

                    <div className="avatar">

                        {userInfo.initials}

                    </div>

                    <div>

                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "14px"
                            }}
                        >
                            {userInfo.name}
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                                color: "#64748b"
                            }}
                        >
                            {userInfo.role}
                        </div>

                    </div>

                </div>

            </div>

        </header>

    );

};

export default TopNavbar;