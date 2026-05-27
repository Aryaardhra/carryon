import React, { useEffect, useState } from "react";
//import {products} from "../data/assets";
import { dummyProducts } from "../assets/data/assets";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/data/assets";
import CartDrawer from "../components/CartDrawer";

import RelatedProduct from "../components/RelatedProduct";
import ReviewSection from "../components/ReviewSection";
import ProductAccordion from "../components/ProductAccordion";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  console.log(productId);
  const product = dummyProducts.find((item) => item._id === productId);
  console.log("product:", product);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  // related products
  useEffect(() => {
    if (product) {
      const filtered = dummyProducts.filter(
        (item) =>
          item.category === product.category && item._id !== product._id,
      );

      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [product]);

  // default thumbnail
  useEffect(() => {
    if (product?.image?.length) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  if (!product) return <p className="mt-10 text-center">Product not found</p>;

  return (
    <>
      <div className="mt-12 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <p className="text-gray-500 text-sm mb-6">
          <Link to="/">Home</Link> /<Link to="/products"> Products</Link> /
          <span className="text-black"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              {/* thumbnails */}
              <div className="flex flex-col gap-3">
                {Array.isArray(product.image) &&
                  product.image.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setThumbnail(image)}
                      className="border w-20 h-20 border-gray-300 rounded overflow-hidden cursor-pointer hover:border-black"
                    >
                      <img
                        src={image}
                        alt={`thumbnail-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>

              {/* main image */}
              <div className="border border-gray-300 rounded overflow-hidden w-[420px] h-[420px] flex items-center justify-center bg-gray-50">
                <img
                  src={thumbnail}
                  alt={product.name}
                  className="object-contain max-h-full"
                />
              </div>
            </div>

            {/* BUTTONS BELOW IMAGE */}
            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Add to Cart
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="flex-1 py-3 bg-black text-white hover:bg-gray-800 rounded"
              >
                Buy Now
              </button>
            </div>
          </div>
          {/* RIGHT SIDE DETAILS */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img key={i} src={assets.rating} alt="star" className="w-4" />
                ))}

              <p className="text-sm text-gray-500 ml-2">(4 Reviews)</p>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-gray-400 line-through">₹{product.price}</p>

              <p className="text-2xl font-semibold text-black">
                ₹{product.offerPrice}
              </p>

              <span className="text-gray-500 text-sm">
                (inclusive of all taxes)
              </span>
            </div>

            <ProductAccordion product={product} />
          </div>
        </div>

        {/* RELATED PRODUCTS */}

        <div className="mt-24">
          <RelatedProduct />
        </div>
      </div>

      <div>
        <ReviewSection />
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
      />
    </>
  );
};
export default ProductDetails;
