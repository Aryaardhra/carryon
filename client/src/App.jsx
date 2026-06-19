import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import CartDrawer from "./components/CartDrawer";

const App = () => {
  const location = useLocation();

  const [showNavbar, setShowNavbar] = useState(location.pathname !== "/");

  return (
    <>
      {/* Hide navbar initially ONLY on Home */}
      <Navbar visible={showNavbar} />

      <CartDrawer />
      <div className="min-h-screen">
        <Toaster position="top-right" />
        <Outlet context={{ setShowNavbar }} />
      </div>
      <Footer />
    </>
  );
};

export default App;
