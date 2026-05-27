import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { itemVariants } from "./Variants";

const filterSections = [
  {
    title: "Category",
    options: [
      "Tote Bags",
      "Crossbody",
      "Shoulder Bags",
      "Clutches",
      "Satchels",
      "Hobo Bags",
    ],
  },
  {
    title: "Color",
    options: [
      "Black",
      "Brown",
      "Beige",
      "White",
      "Navy",
      "Red",
      "Pink",
      "Gold",
    ],
  },
  {
    title: "Price",
    options: [
      "Under $50",
      "$50 - $100",
      "$100 - $200",
      "$200 - $500",
      "Over $500",
    ],
  },
  {
    title: "Material",
    options: ["Leather", "Vegan Leather", "Canvas", "Suede", "Nylon"],
  },
  {
    title: "Size",
    options: ["Small", "Medium", "Large", "Extra Large"],
  },
];

export function FilterSidebar({ filters, onFilterChange }) {
  const [openSections, setOpenSections] = useState([
    "Category",
    "Color",
    "Price",
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
                              {option}
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
            <button className="rounded-md border border-secondary px-12 py-3 text-sm font-medium text-secondary transition hover:bg-secondary/15">
              VIEW
            </button>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
