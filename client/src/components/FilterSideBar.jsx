import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence, color } from "motion/react";
import { itemVariants } from "./Variants";
import { useProductContext } from "../context/ProductContext";
import { categories } from "../assets/data/assets";
import { useCategory } from "../context/CategoryContext";

export function FilterSidebar({ filters, onFilterChange }) {
  const { categories } = useCategory();
  const { clearFilters } = useProductContext();
  const filterSections = [
    {
      title: "category",
      options: categories.map((item) => ({
        label: item.name,
        value: item._id,
      })),
    },
    {
      title: "color",
      options: [
        { label: "Black", value: "Black" },
        { label: "Grey", value: "Grey" },
        { label: "Blue", value: "Blue" },
        { label: "Red", value: "Red" },
        { label: "Green", value: "Green" },
      ],
    },
    {
      title: "material",
      options: [
        { label: "Leather", value: "Leather" },
        { label: "Canvas", value: "Canvas" },
        { label: "Nylon", value: "Nylon" },
        { label: "Suede", value: "Suede" },
        { label: "Vegan Leather", value: "Vegan Leather" },
      ],
    },
    {
      title: "price",
      options: [
        { label: "Below ₹500", value: "below500" },
        { label: "₹500 - ₹2500", value: "500-2500" },
        { label: "₹2500 - ₹4500", value: "2500-4500" },
        { label: "Above ₹4500", value: "4500+" },
      ],
    },
  ];
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
                            key={option.value}
                            className="flex items-center space-x-2.5 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={filters[section.title]?.includes(
                                option.value,
                              )}
                              onChange={() =>
                                onFilterChange(section.title, option.value)
                              }
                              className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm group-hover:text-gray-600">
                              {option.label}
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
