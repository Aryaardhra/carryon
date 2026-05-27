import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import searchIcon from "../assets/search_icon.svg";
import cartIcon from "../assets/cart_icon.svg";
import menuDots from "../assets/menu_dots.svg";
import closeIcon from "../assets/close_icon.svg";

const Navbar = ({ visible = false }) => {
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

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== "/" ? true : prev));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            className="h-8 
                "
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 pl-6 ml-6">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.path}
              className={`group flex flex-col gap-0.5 text-[18px] font-semibold ${isScrolled ? "text-secondary/95" : "text-menu"} hover:text-primary`}
            >
              {link.name}
              <div
                className={`${isScrolled ? "bg-primary/90" : "bg-primary"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </a>
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
            className=" h-6 transition-all duration-500 pr-4"
          />
          <img
            src={cartIcon}
            alt="cart"
            className=" h-6 transition-all duration-500"
          />
          <button className="border border-secondary text-secondary px-8 py-2.5 rounded-full ml-4 transition-all duration-500 hover:bg-secondary/15 ">
            Login
          </button>
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
            <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </a>
          ))}

          {/* <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                        New Launch
                    </button>*/}

          <button className="bg-[#130944] text-white px-8 py-2.5 rounded-full transition-all duration-500">
            Login
          </button>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
