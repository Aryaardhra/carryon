import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence, color } from "motion/react";
import { itemVariants } from "./Variants";
import { useProductContext } from "../context/ProductContext";
import { categories } from "../assets/data/assets";

const filterSections = [
  {
    title: "category",
    options: categories.map((item) => item.path),
  },
  {
    title: "color",
    options: ["Black", "Grey", "Blue", "red", "green"],
  },
  {
    title: "price",
    options: ["Below ₹500", "₹500-₹2500", "₹2500-₹4500", "Above ₹4500"],
  },
  {
    title: "material",
    options: ["Leather", "Vegan Leather", "Canvas", "Suede", "Nylon"],
  },
  {
    title: "sizes",
    options: ["XS", "S", "M", "L", "XL"],
  },
];

export function FilterSidebar({ filters, onFilterChange }) {
  const { clearFilters } = useProductContext();

  const [openSections, setOpenSections] = useState([
    "category",
    "color",
    "price",
  ]);

  const toggleSection = (title) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  return (
    <aside className="w-full">
      <div className="bg-white rounded-lg overflow-hidden ">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="uppercase tracking-wide text-sm">Filter By</h2>
        </div>

        <div>
          {filterSections.map((section, sectionIndex) => {
            const isOpen = openSections.includes(section?.title);
            return (
              <div
                key={section.title}
                className={
                  sectionIndex !== filterSections.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }
              >
                <button
                  onClick={() => toggleSection(section?.title)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="uppercase text-sm tracking-wide">
                    {section?.title}
                  </span>
                  {isOpen ? (
                    <FiChevronUp className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2.5">
                        {section.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2.5 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={filters[section.title]?.includes(option)}
                              onChange={() =>
                                onFilterChange(section.title, option)
                              }
                              className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm group-hover:text-gray-600">
                              {option.replaceAll("_", " ")}
                            </span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-6 justify-center"
          >
            <button
              onClick={clearFilters}
              className="rounded-md border border-secondary px-12 py-3 text-sm font-medium text-secondary transition hover:bg-secondary/15"
            >
              Clear All Filter
            </button>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
