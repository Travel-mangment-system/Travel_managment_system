import { useNavigate } from "react-router-dom";
import "./HomeNavbar.css";

const HomeNavbar = () => {

    const navigate = useNavigate();

    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    const logout = () => {

        localStorage.clear();

        navigate("/login");

    };

    const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

    return (

        <header className="home-navbar">

            <div className="logo">
                <h2>TravelHub</h2>
            </div>

            <div className="right-section">

                <div className="user-box">

                    <div className="avatar">
                        {firstLetter}
                    </div>

                    <div>

                        <h4>{name || "Customer"}</h4>

                        <p>{role}</p>

                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </header>

    );

};

export default HomeNavbar;