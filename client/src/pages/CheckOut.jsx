import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAddresses, addAddress } from "../services/addressService";
import { getCart as getCartAPI } from "../services/cartService";
import { createBuyNowOrder, createCartCheckout} from "../services/orderServices";
import { getProductById } from "../services/productService";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // CHECKOUT TYPE
  const checkoutType = location.state?.checkoutType;
  const buyNowData = location.state?.buyNow;
  const isCartCheckout = checkoutType === "cart";
  const isBuyNowCheckout = checkoutType === "buyNow";

  // CART

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    totalSavings: 0,
  });

  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowVariant, setBuyNowVariant] = useState(null);
  const [buyNowOption, setBuyNowOption] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    pinCode: "",
    isDefault: false,
  });

  const [addingAddress, setAddingAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchAddresses = async () => {
    const response = await getAddresses();
    const fetchedAddresses = response?.data?.addresses || [];
    setAddresses(fetchedAddresses);

    // SELECT DEFAULT ADDRESS
   
    const defaultAddress = fetchedAddresses.find(
      (address) => address.isDefault,
    );

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    } else if (fetchedAddresses.length > 0) {
      setSelectedAddressId(fetchedAddresses[0]._id);
    }
  };

  // FETCH CART
 
  const fetchCart = async () => {
    const response = await getCartAPI();
    const fetchedCart = response?.cart;
    if (fetchedCart) {
      setCart(fetchedCart);
    }
  };

  // FETCH BUY NOW PRODUCT
 
  const fetchBuyNowProduct = async () => {
    if (!buyNowData?.productId) {
      throw new Error("Buy Now product information is missing.");
    }

    if (!buyNowData?.variantId) {
      throw new Error("Buy Now variant information is missing.");
    }

    if (!buyNowData?.size) {
      throw new Error("Buy Now size information is missing.");
    }

    const response = await getProductById(buyNowData.productId);

    const fetchedProduct = response?.data?.product;

    if (!fetchedProduct) {
      throw new Error("Unable to find the selected product.");
    }

    setBuyNowProduct(fetchedProduct);

    // FIND VARIANT
   

    const variant = fetchedProduct.variants?.find(
      (item) => item._id === buyNowData.variantId,
    );

    if (!variant) {
      throw new Error("Selected product variant is unavailable.");
    }

    setBuyNowVariant(variant);

    // FIND SIZE OPTION
  
    const option = variant.options?.find(
      (item) => item.size === buyNowData.size,
    );

    if (!option) {
      throw new Error("Selected product size is unavailable.");
    }

    // FRONTEND STOCK CHECK

    if (option.stock < Number(buyNowData.quantity || 1)) {
      throw new Error(
        `Only ${option.stock} item${option.stock === 1 ? "" : "s"} available.`,
      );
    }

    setBuyNowOption(option);
  };

  // FETCH CHECKOUT DATA

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);

      // ADDRESS IS REQUIRED FOR BOTH FLOWS

      await fetchAddresses();

      // CART CHECKOUT

      if (isCartCheckout) {
        await fetchCart();
      }

      // BUY NOW CHECKOUT

      if (isBuyNowCheckout) {
        await fetchBuyNowProduct();
      }
    } catch (error) {
     
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load checkout information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD DATA

  useEffect(() => {
    if (!isCartCheckout && !isBuyNowCheckout) {
      setLoading(false);
      return;
    }

    fetchCheckoutData();
  }, [
    checkoutType,
    buyNowData?.productId,
    buyNowData?.variantId,
    buyNowData?.size,
  ]);

  // BUY NOW PRICE

  const buyNowPrice = Number(buyNowOption?.price || 0);

  const buyNowSalePrice =
    buyNowOption?.salePrice !== null &&
    buyNowOption?.salePrice !== undefined &&
    buyNowOption?.salePrice !== "" ? Number(buyNowOption.salePrice): null;

  const buyNowFinalPrice = buyNowSalePrice ?? buyNowPrice;
  const buyNowQuantity = Number(buyNowData?.quantity || 1);
  const buyNowSubtotal = buyNowFinalPrice * buyNowQuantity;

  // CART PRICE
  
  const cartSubtotal = Number(cart.subtotal || 0);

  // CURRENT SUBTOTAL
 
  const subtotal = isBuyNowCheckout ? buyNowSubtotal : cartSubtotal;
 
  const shippingFee = 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // ADD ADDRESS

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      setAddingAddress(true);

      const response = await addAddress(addressForm);
      const newAddress = response?.data?.address;
      const updatedAddresses = response?.data?.addresses;

      if (!newAddress) {
        throw new Error("Address was not created.");
      }
      setAddresses(updatedAddresses || []);
      setSelectedAddressId(newAddress._id);
      setShowAddressForm(false);
      setAddressForm({
        fullName: "",
        address: "",
        city: "",
        state: "",
        phone: "",
        pinCode: "",
        isDefault: false,
      });

      toast.success("Address added successfully.");
    } catch (error) {
      console.error("Add address error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to add address.",
      );
    } finally {
      setAddingAddress(false);
    }
  };

  // PLACE ORDER

  const handlePlaceOrder = async () => {

    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }

    if (isBuyNowCheckout && !buyNowData) {
      toast.error("Buy Now information is missing.");
      return;
    }

    if (isCartCheckout && (!cart.items || cart.items.length === 0)) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      let response;

      // BUY NOW

      if (isBuyNowCheckout) {
        response = await createBuyNowOrder({
          productId: buyNowData.productId,
          variantId: buyNowData.variantId,
          size: buyNowData.size,
          quantity: buyNowData.quantity,
          addressId: selectedAddressId,
        });
      }

      // CART
    
      else if (isCartCheckout) {
        response = await createCartCheckout({
          addressId: selectedAddressId,
        });
      }

      // RESPONSE
      
      const data = response?.data;

      if (!data?.success || !data?.checkoutUrl) {
        throw new Error(data?.message || "Unable to create checkout session.");
      }
      // REDIRECT STRIPE

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Place order error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to place order.",
      );
      setPlacingOrder(false);
    }
  };

  // INVALID CHECKOUT
  
  if (!isCartCheckout && !isBuyNowCheckout) {
    return (
      <div className="min-h-screen px-6 pt-32">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            🛒
          </div>

          <h2 className="mt-5 text-2xl font-semibold">
            Invalid Checkout Session
          </h2>

          <p className="mt-2 text-gray-500">
            Please return to your shopping page and try again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // LOADING

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
      
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 max-w-xl text-gray-500">
            {isBuyNowCheckout
              ? "Review your selected product, choose a shipping address, and continue securely to Stripe."
              : "Review your order, select your shipping address, and continue securely to Stripe."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">

          <div className="space-y-8">

            <section className="rounded-3xl border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="shrink-0 text-sm font-semibold text-black underline-offset-4 hover:underline"
                >
                  {showAddressForm ? "Cancel" : "+ Add Address"}
                </button>
              </div>

              {/* =================================================
                  ADD ADDRESS FORM
              ================================================= */}

              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="mt-6 rounded-2xl bg-gray-50 p-5 sm:p-6"
                >
                  <h3 className="font-semibold">Add New Address</h3>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* FULL NAME */}

                    <input
                      type="text"
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleAddressChange}
                      placeholder="Full Name"
                      required
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />

                    {/* PHONE */}

                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      placeholder="Phone Number"
                      required
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />

                    {/* ADDRESS */}

                    <textarea
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      placeholder="Full Address"
                      rows={3}
                      required
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black sm:col-span-2"
                    />

                    {/* CITY */}

                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      required
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />

                    {/* STATE */}

                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      required
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />

                    {/* PIN */}

                    <input
                      type="text"
                      name="pinCode"
                      value={addressForm.pinCode}
                      onChange={handleAddressChange}
                      placeholder="PIN Code"
                      required
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  {/* DEFAULT */}

                  <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4"
                    />

                    <span>Make this my default address</span>
                  </label>

                  {/* SAVE */}

                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="mt-5 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addingAddress ? "Saving..." : "Save Address"}
                  </button>
                </form>
              )}

              {addresses.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {addresses.map((address) => {
                    const selected = selectedAddressId === address._id;

                    return (
                      <div
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`cursor-pointer rounded-2xl border p-5 transition ${
                          selected
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex gap-4">
                          <input
                            type="radio"
                            name="shippingAddress"
                            checked={selected}
                            onChange={() => setSelectedAddressId(address._id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 h-4 w-4"
                          />

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-semibold">
                                {address.fullName}
                              </h3>

                              {address.isDefault && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                              {address.address}
                            </p>

                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} -{" "}
                              {address.pinCode}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    📍
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    You don't have a shipping address yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="mt-4 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white"
                  >
                    Add Shipping Address
                  </button>
                </div>
              )}
            </section>

            //payment
            <section className="rounded-3xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Payment</h2>

              <div className="mt-5 flex gap-4 rounded-2xl bg-gray-50 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  💳
                </div>

                <div>
                  <p className="font-medium">Stripe Secure Payment</p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    You will be redirected to Stripe to securely complete your
                    payment.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div>
            <div className="rounded-3xl border border-gray-200 p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              {isBuyNowCheckout &&
                buyNowProduct &&
                buyNowVariant &&
                buyNowOption && (
                  <div className="mt-6">
                    <div className="flex gap-4 border-b border-gray-100 pb-5">
                      {/* IMAGE */}

                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={
                            buyNowVariant.images?.[0]?.url ||
                            buyNowProduct.featuredImage?.url
                          }
                          alt={buyNowProduct.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold">
                          {buyNowProduct.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Color: {buyNowVariant.color?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          Size: {buyNowData.size}
                        </p>

                        <p className="text-xs text-gray-500">
                          Quantity: {buyNowQuantity}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          ₹{buyNowFinalPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {isCartCheckout && (
                <div className="mt-6 space-y-5">
                  {cart.items.map((item) => {
                    const itemPrice = Number(
                      item.variant?.salePrice ?? item.variant?.price ?? 0,
                    );

                    const itemTotal = itemPrice * item.quantity;

                    return (
                      <div
                        key={item.cartItemId}
                        className="flex gap-4 border-b border-gray-100 pb-5"
                      >
                        {/* IMAGE */}

                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={item.variant?.selectedImage}
                            alt={item.product?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-semibold">
                            {item.product?.name}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            Color: {item.variant?.color?.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            Size: {item.variant?.size}
                          </p>

                          <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 space-y-3 border-t pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>

                  <span className="font-medium">Free</span>
                </div>

                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>

                    <span className="font-medium">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-4 text-xl font-bold">
                  <span>Total</span>

                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  !selectedAddressId ||
                  placingOrder ||
                  (isCartCheckout && cart.items.length === 0) ||
                  (isBuyNowCheckout && !buyNowOption)
                }
                onClick={handlePlaceOrder}
                className="mt-7 w-full rounded-2xl bg-black py-4 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {placingOrder ? "Redirecting to Stripe..." : "Pay with Stripe"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span>

                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
