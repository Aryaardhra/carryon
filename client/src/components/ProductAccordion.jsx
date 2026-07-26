import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiStar,
  FiGrid,
  FiDroplet,
  FiMaximize,
  FiInfo,
  FiTruck,
} from "react-icons/fi";

const AccordionItem = ({ icon, title, children, isOpen, onClick }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between px-6 py-5 transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            {icon}
          </div>

          <span className="text-lg font-semibold">{title}</span>
        </div>

        {isOpen ? (
          <FiChevronUp className="text-xl" />
        ) : (
          <FiChevronDown className="text-xl" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-6 py-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductAccordion = ({ product }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sizes = [
    ...new Set(
      product?.variants?.flatMap((variant) =>
        variant.options.map((option) => option.size),
      ) || [],
    ),
  ];

  const colors = [
    ...new Map(
      product?.variants?.map((variant) => [
        variant.color.name,
        variant.color,
      ]) || [],
    ).values(),
  ];

  return (
    <div className="space-y-5">
      {/* Description */}

      <AccordionItem
        icon={<FiFileText size={22} />}
        title="Product Description"
        isOpen={openIndex === 0}
        onClick={() => toggle(0)}
      >
        <p className="leading-8 text-gray-600">{product?.description}</p>
      </AccordionItem>

      {/* Highlights */}

      <AccordionItem
        icon={<FiStar size={22} />}
        title="Why You'll Love It"
        isOpen={openIndex === 1}
        onClick={() => toggle(1)}
      >
        <div className="grid gap-4">
          {product?.highlights?.length ? (
            product.highlights.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-white">
                  ✓
                </div>

                <p>{item}</p>
              </div>
            ))
          ) : (
            <p>No highlights available.</p>
          )}
        </div>
      </AccordionItem>

      {/* Specifications */}

      <AccordionItem
        icon={<FiGrid size={22} />}
        title="Specifications"
        isOpen={openIndex === 2}
        onClick={() => toggle(2)}
      >
        <div className="overflow-hidden rounded-xl border">
          {product?.specifications?.map((spec, index) => (
            <div
              key={index}
              className={`grid grid-cols-2 px-5 py-4 ${
                index !== product.specifications.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="text-gray-500">{spec.key}</span>

              <span className="text-right font-semibold">{spec.value}</span>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Colors */}

      <AccordionItem
        icon={<FiDroplet size={22} />}
        title="Available Colors"
        isOpen={openIndex === 3}
        onClick={() => toggle(3)}
      >
        <div className="flex flex-wrap gap-4">
          {colors.map((color) => (
            <div
              key={color.name}
              className="flex items-center gap-3 rounded-full border px-4 py-2"
            >
              <span
                className="h-5 w-5 rounded-full border"
                style={{
                  backgroundColor: color.hex || "#ddd",
                }}
              />

              {color.name}
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Sizes */}

      <AccordionItem
        icon={<FiMaximize size={22} />}
        title="Available Sizes"
        isOpen={openIndex === 4}
        onClick={() => toggle(4)}
      >
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <span
              key={size}
              className="rounded-xl border px-5 py-3 font-medium transition hover:bg-secondary hover:text-white"
            >
              {size}
            </span>
          ))}
        </div>
      </AccordionItem>

      {/* Product Details */}

      <AccordionItem
        icon={<FiInfo size={22} />}
        title="Product Details"
        isOpen={openIndex === 5}
        onClick={() => toggle(5)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Brand</p>
            <p className="mt-2 font-semibold">{product?.brand}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Category</p>
            <p className="mt-2 font-semibold">{product?.category?.name}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Suitable For</p>
            <p className="mt-2 font-semibold">
              {product?.suitableFor?.join(", ")}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Total Stock</p>
            <p className="mt-2 font-semibold">{product.totalStock}</p>
          </div>
        </div>
      </AccordionItem>

      {/* Shipping */}

      <AccordionItem
        icon={<FiTruck size={22} />}
        title="Shipping & Returns"
        isOpen={openIndex === 6}
        onClick={() => toggle(6)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border p-5">
            <h4 className="font-semibold">🚚 Free Shipping</h4>

            <p className="mt-2 text-gray-500">Free shipping on every order.</p>
          </div>

          <div className="rounded-xl border p-5">
            <h4 className="font-semibold">🔄 Easy Returns</h4>

            <p className="mt-2 text-gray-500">
              7-day return & exchange with original packaging.
            </p>
          </div>
        </div>
      </AccordionItem>
    </div>
  );
};

export default ProductAccordion;
