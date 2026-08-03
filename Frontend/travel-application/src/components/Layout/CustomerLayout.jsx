import CustomerSidebar from "./CustomerSidebar";
import TopNavbar from "./TopNavbar";
import "./CustomerLayout.css";

const CustomerLayout = ({ children }) => {

    return (

        <div className="customer-layout">

            <CustomerSidebar />

            <div className="customer-main">

                <TopNavbar />

                <div className="customer-content">

                    {children}

                </div>

            </div>

        </div>

    );

};

export default CustomerLayout;