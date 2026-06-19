import React, { useEffect, useState } from "react";
import { dummyProducts } from "../assets/data/assets";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/data/assets";
import RelatedProduct from "../components/RelatedProduct";
import ReviewSection from "../components/ReviewSection";
import ProductAccordion from "../components/ProductAccordion";
import { useProductContext } from "../context/ProductContext";
import { useCartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { products } = useProductContext();
  const {
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  } = useCartContext();
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item._id === productId);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // related products
  useEffect(() => {
    if (product) {
      const filtered = products.filter(
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

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.color?.[0] || "");
    }
  }, [product]);

  if (!product) return <p className="mt-10 text-center">Product not found</p>;

  return (
    <>
      <div className="mt-12 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <p className="text-gray-500 text-sm mb-6 pt-10">
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
                onClick={() => {
                  addToCart(product._id, selectedSize, selectedColor);

                  setIsCartOpen(true);
                }}
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  addToCart(product._id, selectedSize, selectedColor);

                  setIsCartOpen(true);
                }}
                className="flex-1 py-3 bg-secondary text-white hover:bg-primary rounded"
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

            <div className="mt-6">
              <h3 className="font-medium mb-2">Select Size</h3>

              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size ? "bg-secondary text-white" : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Select Color</h3>

              <div className="flex flex-wrap gap-2">
                {product.color.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color
                        ? "bg-secondary text-white"
                        : "bg-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <ProductAccordion product={product} />
          </div>
        </div>

        {/* RELATED PRODUCTS */}

        <div className="mt-24">
          <RelatedProduct products={relatedProducts} />
        </div>
      </div>

      <div>
        <ReviewSection />
      </div>
    </>
  );
};
export default ProductDetails;
