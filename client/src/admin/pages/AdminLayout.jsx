import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/data/assets";
import { MdLibraryAdd } from "react-icons/md";
import { IoMdList } from "react-icons/io";
import { GoTasklist } from "react-icons/go";

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  const sidebarLinks = [
     {
      name: "Category List",
      path: "/admin/category-list",
      icon: <IoMdList className="text-gray-800" />,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <MdLibraryAdd className="text-gray-800" />,
    },
    {
      name: "Product List",
      path: "/admin/product-list",
      icon: <IoMdList className="text-gray-800" />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <GoTasklist className="text-gray-800" />,
    },
  ];

  const logout = async () => {
    setIsSeller(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img
            className="cursor-pointer w-34 md:w-38"
            src={assets.logo}
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-700">
          <p>Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-text"
                                : "hover:bg-gray-100/90 border-white"
                            }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
