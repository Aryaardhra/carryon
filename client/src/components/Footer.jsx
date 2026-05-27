import React from "react";
import Title from "./Title";
import { Link } from "react-router-dom";
import { assets } from "../assets/data/assets";

const Footer = () => {
  return (
    <>
      <div className="text-gray-900 pt-8 px-6 md:px-8 lg:px-16 xl:px-20 bg-[#d3cdcd]">
        <div className="flex flex-wrap justify-between gap-12 md:gap-6">
          <div>
            <span className=" font-lora ">
              <Title
                title="CONTACT US"
                size="text-xl"
                font="font-semibold font-inknut"
              />
            </span>
            <ul className="mt-3 flex flex-col justify-center p-1 gap-2 text-xs font-serif font-semibold text-secondary ">
              <li>
                <Link className="flex flew-row h-6 hover:text-primary" to="/">
                  <img src={assets.location_icon} />
                  123,vhykk,jiutj
                </Link>
              </li>
              <li>
                <Link className="flex flew-row h-6 hover:text-primary" to="/">
                  <img src={assets.message_icon} />
                  carryon@gmail.in
                </Link>
              </li>
              <li>
                <Link className="flex flew-row h-6 hover:text-primary" to="/">
                  <img src={assets.ph_icon} />
                  +91 xxxxxxx89
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-lg text-gray-800 font-playfair">
              <Link to="/">
                <img
                  src={assets.logo}
                  alt=""
                  className="h-8 
                                      "
                />
              </Link>
            </span>
            <ul className="mt-3 flex flex-col items-center gap-2 text-xs font-serif font-semibold text-secondary">
              <li>
                <Link to="/" className="hover:text-primary">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Our Blogs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-lg text-gray-800 font-playfair">
              <Title
                title="USEFUL LINKS"
                size="text-xl"
                font="font-semibold font-inknut"
              />
            </span>
            <ul className="mt-3 flex flex-col items-center gap-2 text-xs font-serif font-semibold text-secondary">
              <li>
                <Link to="/" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-lg text-gray-800 font-playfair">
              <Title
                title="INSTAGRAM"
                size="text-xl"
                font="font-semibold font-inknut"
              />
            </span>
            <div className="grid grid-cols-3 gap-1">
              <img
                src="https://images.unsplash.com/photo-1705869213986-cc8dc227fae4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ3fHxiYWdzfGVufDB8fDB8fHww"
                alt="instaImg1"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1656238558925-a8bab7821a6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU2fHxiYWdzfGVufDB8fDB8fHww"
                alt="instaImg2"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1674701258951-4b70541b7aca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGJhZ3N8ZW58MHx8MHx8fDA%3D"
                alt="instaImg3"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1681747685985-a401c271156c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGJhZ3N8ZW58MHx8MHx8fDA%3D"
                alt="instaImg4"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1708612468165-4fbcdf1fc1d0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg2fHxiYWdzfGVufDB8fDB8fHww"
                alt="instaImg5"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1533120238546-f0d4fa4d05c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjk0fHxiYWdzfGVufDB8fDB8fHww"
                alt="instaImg6"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1705869213986-cc8dc227fae4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ3fHxiYWdzfGVufDB8fDB8fHww"
                alt="instaImg1"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1656238558925-a8bab7821a6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU2fHxiYWdzfGVufDB8fDB8fHww"
                alt="instaImg2"
                className="h-20 w-20"
              />
              <img
                src="https://images.unsplash.com/photo-1674701258951-4b70541b7aca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGJhZ3N8ZW58MHx8MHx8fDA%3D"
                alt="instaImg3"
                className="h-20 w-20"
              />
            </div>
          </div>
        </div>
        <p className="py-4 text-center text-xs  text-gray-600/80">
          Copyright {new Date().getFullYear()} © Carryon.in All Right Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
