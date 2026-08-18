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
      console.error("Fetch product error:", error);
      toast.error(error?.response?.data?.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product || !products?.length) return;

    const related = products
      .filter(
        (item) =>
          item._id !== product._id && item.category === product.category,
      )
      .slice(0, 4);

    setRelatedProducts(related);
  }, [product, products]);

  // RESET SELECTION WHEN PRODUCT CHANGES

  useEffect(() => {
    if (!product) return;

    setSelectedColor(null);
    setSelectedSize(null);

    if (product.featuredImage?.url) {
      setSelectedImage(product.featuredImage);
    } else if (product.productImages?.length) {
      setSelectedImage(product.productImages[0]);
    } else {
      setSelectedImage(null);
    }
  }, [product]);

  // SELECTED VARIANT

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor) {
      return null;
    }

    return (
      product.variants?.find(
        (variant) => variant.color?.name === selectedColor,
      ) || null
    );
  }, [product, selectedColor]);

  // DISPLAY IMAGES

  const displayImages = useMemo(() => {
    if (!product) return [];

    const images = [];

    if (product.featuredImage?.url) {
      images.push(product.featuredImage);
    }

    if (product.productImages?.length) {
      images.push(...product.productImages);
    }

    if (selectedVariant?.images?.length) {
      images.push(...selectedVariant.images);
    }

    return images.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url),
    );
  }, [product, selectedVariant]);

  // CHANGE MAIN IMAGE WHEN COLOR CHANGES

  useEffect(() => {
    if (!product) return;

    if (selectedVariant?.images?.length) {
      setSelectedImage(selectedVariant.images[0]);
      return;
    }

    if (product.featuredImage?.url) {
      setSelectedImage(product.featuredImage);
      return;
    }

    if (product.productImages?.length) {
      setSelectedImage(product.productImages[0]);
    }
  }, [selectedVariant, product]);

  // AVAILABLE SIZES

  const sizes = useMemo(() => {
    if (!selectedVariant) return [];

    return selectedVariant.options || [];
  }, [selectedVariant]);

  // SELECTED SIZE OPTION
  
  const selectedOption = useMemo(() => {
    if (!selectedVariant) return null;

    // If user selected a size, find it
    if (selectedSize) {
      const selected = selectedVariant.options?.find(
        (option) => option.size === selectedSize,
      );

      if (selected) {
        return selected;
      }
    }

    // Otherwise find first available size
    return (
      selectedVariant.options?.find((option) => option.stock > 0) ||
      selectedVariant.options?.[0] ||
      null
    );
  }, [selectedVariant, selectedSize]);

  // PRICE

  const price = selectedOption?.price ?? product?.minPrice ?? 0;
  const salePrice = selectedOption?.salePrice ?? null;

  // STOCK

  const stock = selectedOption?.stock ?? product?.totalStock ?? 0;

  // HANDLE COLOR

  const handleColorChange = (variant) => {
    setSelectedColor(variant.color.name);

    const firstAvailable =
      variant.options?.find((option) => option.stock > 0) ||
      variant.options?.[0];

    setSelectedSize(firstAvailable?.size || null);
  };

  // ADD TO CART

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a color.");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    if (!selectedImage?.url) {
      toast.error("Product image is unavailable.");
      return;
    }

    addToCart({
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      selectedImage: selectedImage.url,
      quantity: 1,
    });

    setIsCartOpen(true);

    toast.success("Added to cart.");
  };

  // BUY NOW
  
  const handleBuyNow = () => {
    
    // COLOR VALIDATION

    if (!selectedVariant) {
      toast.error("Please select a color.");
      return;
    }

    // SIZE VALIDATION
   
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    // STOCK VALIDATION

    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    // VARIANT VALIDATION
    
    if (!selectedVariant._id) {
      toast.error("Product variant is unavailable.");
      return;
    }

    // NAVIGATE TO CHECKOUT

    navigate("/checkout", {
      state: {
        checkoutType: "buyNow",

        buyNow: {
          productId: product._id,
          variantId: selectedVariant._id,
          size: selectedSize,
          quantity: 1,
        },
      },
    });
  };


  if (loading) {
    return <div className="mt-40 text-center">Loading Product...</div>;
  }
  if (!product) {
    return <div className="mt-40 text-center">Product Not Found</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-24">
  
        <p className="mb-8 text-sm text-gray-500">
          <Link to="/">Home</Link>
          {" / "}
          <Link to="/collection">Collection</Link>
          {" / "}
          <span className="text-black">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[55%_45%]">

          <div className="space-y-6">
         
            <div className="flex gap-5">
              {/* THUMBNAILS */}

              <div className="flex flex-col gap-3">
                {displayImages.map((image) => (
                  <button
                    key={image.url}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-20 w-20 overflow-hidden rounded-2xl transition-all duration-300 ${
                      selectedImage?.url === image.url
                        ? "ring-2 ring-secondary shadow-lg"
                        : "border border-gray-200 hover:border-secondary"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* MAIN IMAGE */}

              <div className="flex-1">
                <div className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-3xl border border-gray-200 bg-[#f8f8f8] shadow-sm">
                  {/* SALE BADGE */}

                  {salePrice && (
                    <span className="absolute left-5 top-5 z-20 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
                      SALE
                    </span>
                  )}

                  {/* WISHLIST */}

                  <button
                    type="button"
                    className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
                  >
                    <FaHeart className="text-gray-500" />
                  </button>

                  {/* IMAGE */}

                  <div className="flex min-h-[500px] items-center justify-center overflow-hidden">
                    {selectedImage?.url && (
                      <img
                        src={selectedImage.url}
                        alt={product.name}
                        className="max-h-[90%] max-w-[90%] object-contain transition duration-500 hover:scale-105"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* ADD TO CART */}

              <button
                type="button"
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className="rounded-2xl border border-gray-300 bg-white py-4 text-lg font-medium transition hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to Cart
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                disabled={stock <= 0 || !selectedVariant || !selectedSize}
                onClick={handleBuyNow}
                className="rounded-2xl bg-secondary py-4 text-lg font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {/* PRODUCT NAME */}

            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-900 lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex text-lg text-amber-400">★★★★★</div>

                <span className="text-gray-500">
                  {product.totalReviews} Reviews
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                {stock > 0 ? (
                  <span className="font-medium text-green-600">In Stock</span>
                ) : (
                  <span className="font-medium text-red-500">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end gap-5">
                {salePrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                )}

                <span className="text-5xl font-bold text-secondary">
                  ₹{Number(salePrice || price).toLocaleString("en-IN")}
                </span>
              </div>

              {salePrice && (
                <p className="mt-3 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  You Save ₹{Number(price - salePrice).toLocaleString("en-IN")}
                </p>
              )}

              <p className="mt-3 text-sm text-gray-500">
                Inclusive of all taxes.
              </p>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-10">
              <p className="leading-8 text-gray-600">{product.description}</p>
            </div>
               // COLOR
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">Select Color</h3>

              <div className="flex flex-wrap gap-3">
                {product.variants?.map((variant) => (
                  <button
                    key={variant._id}
                    type="button"
                    onClick={() => handleColorChange(variant)}
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

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">Select Size</h3>

              {!selectedVariant ? (
                <p className="text-sm text-gray-500">
                  Please select a color first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {sizes.map((option) => (
                    <button
                      key={option.size}
                      type="button"
                      disabled={option.stock === 0}
                      onClick={() => setSelectedSize(option.size)}
                      className={`h-14 w-14 rounded-xl border transition ${
                        selectedSize === option.size
                          ? "border-secondary bg-secondary text-white shadow-lg"
                          : "border-gray-300"
                      } ${
                        option.stock === 0
                          ? "cursor-not-allowed opacity-40"
                          : "hover:border-secondary"
                      }`}
                    >
                      {option.size}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                <h4 className="font-semibold">Secure Checkout</h4>

                <p className="mt-2 text-sm text-gray-500">
                  100% encrypted payment powered by Stripe.
                </p>
              </div>
            </div>


            <div className="mt-12">
              <h3 className="mb-5 text-xl font-semibold">Why You'll Love It</h3>

              <div className="grid gap-4">
                {product.highlights?.map((highlight, index) => (
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


        <div className="mt-24">
          <ProductAccordion product={product} />
        </div>

        <div className="mt-24">
          <RelatedProduct products={relatedProducts} />
        </div>

        <div className="mt-24">
          <ReviewSection />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
