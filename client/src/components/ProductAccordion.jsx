import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="font-medium">{title}</span>

        {isOpen ? <FiMinus /> : <FiPlus />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductAccordion = ({ product }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-8">
      <AccordionItem
        title="Product Description"
        isOpen={openIndex === 0}
        onClick={() => toggle(0)}
      >
        <ul>
          {Array.isArray(product.about) ? (
            product.about.map((desc, index) => (
              <li key={index}>
                <span>*</span> {desc}
              </li>
            ))
          ) : (
            <li>
              <span>*</span>
              {product.about}
            </li>
          )}
        </ul>
      </AccordionItem>

      <AccordionItem
        title="Specifications"
        isOpen={openIndex === 1}
        onClick={() => toggle(1)}
      >
        Material: {product.material || "Premium Fabric"} <br />
        Size: {product.size || "Medium"} <br />
        Color: {product.color[0] || "Multiple"}
      </AccordionItem>

      <AccordionItem
        title="Hassle-Free Returns & Exchange"
        isOpen={openIndex === 2}
        onClick={() => toggle(2)}
      >
        7 Days easy return and exchange available.
      </AccordionItem>

      <AccordionItem
        title="More Information"
        isOpen={openIndex === 3}
        onClick={() => toggle(3)}
      >
        Country of Origin:{product.country_of_origin} <br />
        Manufacturer: {product.manufacturer}
      </AccordionItem>
    </div>
  );
};

export default ProductAccordion;
