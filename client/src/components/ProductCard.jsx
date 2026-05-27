import React from "react";
import { ArrowRight, Mountain } from "lucide-react";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

export function ProductCard({ products }) {
  console.log("products", products);
  return (
    <>
      {products?.map((product) => (
        <Link to={(`/products/${product._id}`)}  
        key={product._id}  
        onClick={() => window.scrollTo(0, 0)}>
          <div
            className="group relative shrink-0
            h-[240px] w-[260px]
            max-w-sm overflow-hidden rounded-3xl
            shadow-2xl transition-all duration-500 ease-in-out
            hover:-translate-y-3"
          >
            {/* Background Image */}
            <img
              src={product?.image}
              alt={product?.name}
              className="absolute inset-0 h-full w-full object-cover
              transition-transform duration-700 group-hover:scale-110"
             />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between  p-4 text-amber-50">
              <div className="flex justify-between">
                {/* Logo */}
                <div className="flex items-start">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full
                    border border-white/40 bg-white/10 backdrop-blur-md"
                  >
                    <FaHeart className="h-5 w-5 text-[#4c1c1c]" />
                  </div>
                </div>

                <div className="flex items-end">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full
                     border border-white/40 bg-white/10 backdrop-blur-md"
                  >
                    <FaShoppingCart className="h-5 w-5 text-[#4c1c1c]" />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div
                className="space-y-5 transition-all duration-500
                 group-hover:-translate-y-12"
              >
                {/* Title */}
                <div>
                  <h2 className="text-xl font-medium leading-tight">
                    {product?.name}
                  </h2>
                </div>
              </div>

              {/* Bottom Reveal */}
              <div
                className="
            absolute bottom-0 left-0 w-full p-6
            translate-y-full opacity-0
            transition-all duration-500
            group-hover:translate-y-2
            group-hover:opacity-100
          "
              >
                <div className="flex items-end justify-between">
                  {/* Price */}
                  <div>
                    <h3 className="text-sm font-light line-through">
                      ₹ {product.offerPrice}
                    </h3>

                    {/* <p className="text-xl font-medium text-white/80">
                ₹ {price}
              </p>*/}
                  </div>

                  <div>
                    <p className="text-xl font-medium text-white/80">
                      ₹ {product.price}
                    </p>
                  </div>
              
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
