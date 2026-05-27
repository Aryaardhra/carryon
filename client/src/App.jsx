import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer';

const App = () => {
  const location = useLocation();

  const [showNavbar, setShowNavbar] = useState(
    location.pathname !== "/"
  );

  return (
    <>
      {/* Hide navbar initially ONLY on Home */}
      <Navbar visible={showNavbar} />

      <div className="min-h-screen">
        <Outlet context={{ setShowNavbar }} />
      </div>
      <Footer />
    </>
  );
}

export default App
