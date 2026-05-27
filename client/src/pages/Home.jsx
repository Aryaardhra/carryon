import React, { useState } from 'react'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Navbar from '../components/Navbar';
import { useOutletContext } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { assets } from '../assets/data/assets';
import { Mountain } from 'lucide-react';
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import Banner from '../components/Banner';
import ServicesBanner from '../components/ServicesBanner';
import NewsLetter from '../components/NewsLetter';
import OurBlog from '../components/OurBlog';
const Home = () => {

   const { setShowNavbar } = useOutletContext();
  /*   const handleBooking = () => {
    alert("Booking initiated!");
  };*/

  return (
    <>
      <Hero setShowNavbar={setShowNavbar} />
      <Categories />
      <LatestCollection />
      <BestSeller />
      <Banner />
      <ServicesBanner />
      <NewsLetter />
      <OurBlog />
    </>
  );
};

export default Home