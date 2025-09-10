import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/store/auth";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const GuestLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role) {
            navigate(`/${user.role}`);
        }

        window.scrollTo(0, 0);
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default GuestLayout;