import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import searchIcon from "../assets/search_icon.svg";
import cartIcon from "../assets/cart_icon.svg";
import menuDots from "../assets/menu_dots.svg";
import closeIcon from "../assets/close_icon.svg";
import { useCartContext } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { useAuthContext } from "../context/AuthContext";
import { assets } from "../assets/data/assets";
import { useProductContext } from "../context/ProductContext";

const Navbar = ({ visible = false }) => {
  const { user, setUser } = useAuthContext();
  const { searchQuery, setSearchQuery } = useProductContext();
  const { getCartCount, setIsCartOpen, isCartOpen } = useCartContext();
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/collection");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const logout = async () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-evenly 
                 transition-all duration-500 z-50 ${
                   visible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 -translate-y-full pointer-events-none"
                 } ${isScrolled ? "bg-[#ddd6d6] shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt=""
            className="h-8"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 pl-6 ml-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex flex-col gap-0.5 text-[18px] font-semibold ${isScrolled ? "text-secondary/95" : "text-menu"} hover:text-primary`}
            >
              {link.name}
              <div
                className={`${isScrolled ? "bg-primary/90" : "bg-primary"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </Link>
          ))}
          {/* <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}>
                        New Launch
                    </button>*/}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4 ">
          <img
            src={searchIcon}
            alt="search"
            onClick={() => setShowSearch(!showSearch)}
            className="h-6 cursor-pointer"
          />

          {showSearch && (
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded-full"
            />
          )}
          <div
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer"
          >
            <img
              src={cartIcon}
              alt="cart"
              className=" h-6 transition-all duration-500"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="border border-secondary text-secondary px-8 py-2.5 rounded-full ml-4 transition-all duration-500 hover:bg-secondary/15 "
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_img}
                alt="profile_icon"
                className="w-8 h-8 rounded-full object-cover ml-2 cursor-pointer"
              />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2 w-32 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("/my-orders")}
                  className="p-1 5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="py-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <img
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            src={menuDots}
            alt="search"
            className="h-10"
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={closeIcon} alt="close icon" className="h-6.5" />
          </button>

          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link to="/my-orders" onClick={() => setIsMenuOpen(false)}>
              My Orders
            </Link>
          )}
          {/* <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                        New Launch
                    </button>*/}
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#130944] text-white px-8 py-2.5 rounded-full transition-all duration-500"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-[#130944] hover:bg-secondary transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
