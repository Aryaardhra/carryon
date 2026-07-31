import React, { useEffect, useMemo, useState } from "react";
import { dummyProducts } from "../assets/data/assets";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/data/assets";
import RelatedProduct from "../components/RelatedProduct";
import ReviewSection from "../components/ReviewSection";
import ProductAccordion from "../components/ProductAccordion";
import { useProductContext } from "../context/ProductContext";
import { useCartContext } from "../context/CartContext";
import { getProductById } from "../services/productService";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products } = useProductContext();
  const { addToCart, setIsCartOpen } = useCartContext();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProductById(productId);
      setProduct(data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product) return;

    setSelectedColor(null);
    setSelectedSize(null);

    if (product.featuredImage?.url) {
      setSelectedImage(product.featuredImage);
    } else if (product.productImages?.length) {
      setSelectedImage(product.productImages[0]);
    }
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor) return null;

    return (
      product.variants.find(
        (variant) => variant.color.name === selectedColor,
      ) || null
    );
  }, [product, selectedColor]);

  const displayImages = useMemo(() => {
    if (!product) return [];

    const images = [];

    // Featured image
    if (product.featuredImage?.url) {
      images.push(product.featuredImage);
    }

    // Gallery images
    if (product.productImages?.length) {
      images.push(...product.productImages);
    }

    // Selected color images
    if (selectedVariant?.images?.length) {
      images.push(...selectedVariant.images);
    }

    // Remove duplicate URLs
    return images.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url),
    );
  }, [product, selectedVariant]);

  useEffect(() => {
    if (!product) return;

    // If a color is selected, always show its first image
    if (selectedVariant?.images?.length) {
      setSelectedImage(selectedVariant.images[0]);
      return;
    }

    // Otherwise show featured/gallery
    if (product.featuredImage?.url) {
      setSelectedImage(product.featuredImage);
    } else if (product.productImages?.length) {
      setSelectedImage(product.productImages[0]);
    }
  }, [selectedVariant, product]);

  const sizes = useMemo(() => {
    if (!selectedVariant) return [];

    return selectedVariant.options;
  }, [selectedVariant]);

  const selectedOption = useMemo(() => {
    if (!selectedVariant) return null;

    return (
      selectedVariant.options.find((option) => option.size === selectedSize) ??
      selectedVariant.options.find((option) => option.stock > 0) ??
      selectedVariant.options[0] ??
      null
    );
  }, [selectedVariant, selectedSize]);

  const price = selectedOption?.price ?? product?.minPrice ?? 0;

  const salePrice = selectedOption?.salePrice ?? null;

  const stock = selectedOption?.stock ?? product?.totalStock ?? 0;

  const handleBuyNow = () => {
    if (!selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    if (stock <= 0) {
      toast.error("Product is out of stock.");
      return;
    }

    addToCart({
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      selectedImage: selectedImage.url,
      quantity: 1,
    });

    navigate("/checkout");
  };
  if (loading) {
    return <div className="mt-40 text-center">Loading Product...</div>;
  }

  if (!product) {
    return <div className="mt-40 text-center">Product Not Found</div>;
  }
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Breadcrumb */}

        <p className="text-sm text-gray-500 mb-8">
          <Link to="/">Home</Link>
          {" / "}
          <Link to="/collection">Collection</Link>
          {" / "}
          <span className="text-black">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-14 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div className="flex gap-5">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {displayImages.map((image) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage?.url === image.url
                        ? "ring-2 ring-secondary shadow-lg"
                        : "border border-gray-200 hover:border-secondary"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div className="relative w-full max-w-[500px] mx-auto overflow-hidden rounded-3xl bg-[#f8f8f8] border border-gray-200 shadow-sm">
                  {/* Badge */}
                  {salePrice && (
                    <span className="absolute left-5 top-5 z-20 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
                      SALE
                    </span>
                  )}

                  {/* Wishlist */}
                  <button className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:scale-105 transition">
                    <FaHeart className="text-gray-500" />
                  </button>

                  <div className="flex h-full items-center justify-center overflow-hidden">
                    <img
                      src={selectedImage?.url}
                      alt={product.name}
                      className="max-h-[90%] max-w-[90%] object-contain transition duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Below Image */}
            <div className="grid grid-cols-2 gap-5">
              <button
                disabled={stock === 0}
                onClick={() => {
                  addToCart({
                    productId: product._id,
                    color: selectedColor,
                    size: selectedSize,
                    selectedImage: selectedImage.url,
                    quantity: 1,
                  });

                  setIsCartOpen(true);
                }}
                className="rounded-2xl border border-gray-300 bg-white py-4 text-lg font-medium transition hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to Cart
              </button>

              <button
                disabled={stock === 0}
                onClick={handleBuyNow}
                className="rounded-2xl bg-secondary py-4 text-lg font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="flex flex-col">
            {/* Product Name */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex text-amber-400 text-lg">★★★★★</div>

                <span className="text-gray-500">
                  {product.totalReviews} Reviews
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                {stock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mt-10">
              <div className="flex items-end gap-5">
                {salePrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{price}
                  </span>
                )}

                <span className="text-5xl font-bold text-secondary">
                  ₹{salePrice || price}
                </span>
              </div>

              {salePrice && (
                <p className="mt-3 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  You Save ₹{price - salePrice}
                </p>
              )}

              <p className="mt-3 text-sm text-gray-500">
                Inclusive of all taxes.
              </p>
            </div>

            {/* Description */}

            <div className="mt-10">
              <p className="leading-8 text-gray-600">{product.description}</p>
            </div>

            {/* Color */}

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">Select Color</h3>

              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => {
                      setSelectedColor(variant.color.name);

                      const firstAvailable =
                        variant.options.find((o) => o.stock > 0) ??
                        variant.options[0];

                      setSelectedSize(firstAvailable?.size ?? null);
                    }}
                    className={`rounded-xl border px-6 py-3 transition-all duration-300 ${
                      selectedColor === variant.color.name
                        ? "border-secondary bg-secondary text-white shadow-lg"
                        : "border-gray-300 hover:border-secondary"
                    }`}
                  >
                    {variant.color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">Select Size</h3>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.size}
                    disabled={size.stock === 0}
                    onClick={() => setSelectedSize(size.size)}
                    className={`h-14 w-14 rounded-xl border transition

                   ${
                     selectedSize === size.size
                     ? "bg-secondary text-white border-secondary shadow-lg"
                     : "border-gray-300"
                    }

                  ${
                   size.stock === 0
                   ? "opacity-40 cursor-not-allowed"
                   : "hover:border-secondary"
                   }`}
                   >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Cards */}

            <div className="mt-12 grid gap-4">
              <div className="rounded-2xl border border-gray-200 p-5">
                <h4 className="font-semibold">Free Shipping</h4>

                <p className="mt-2 text-sm text-gray-500">
                  Complimentary shipping on all orders.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <h4 className="font-semibold">Easy Returns</h4>

                <p className="mt-2 text-sm text-gray-500">
                  Hassle-free 7 day return & exchange.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <h4 className="font-semibold"> Secure Checkout</h4>

                <p className="mt-2 text-sm text-gray-500">
                  100% encrypted payment powered by Stripe.
                </p>
              </div>
            </div>

            {/* Highlights */}

            <div className="mt-12">
              <h3 className="mb-5 text-xl font-semibold">Why You'll Love It</h3>

              <div className="grid gap-4">
                {product.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                      ✓
                    </div>

                    <p className="text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accordion */}

        <div className="mt-24">
          <ProductAccordion product={product} />
        </div>

        {/* Related */}

        <div className="mt-24">
          <RelatedProduct products={relatedProducts} />
        </div>

        {/* Reviews */}

        <div className="mt-24">
          <ReviewSection />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
