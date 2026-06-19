import React, { useEffect, useState } from "react";
import { assets } from "../assets/data/assets";
import Title from "../components/Title";
import BestSeller from "../components/BestSeller";
import { motion, AnimatePresence } from "motion/react";
import { CollectionHeader } from "../components/CollectionHeader";
import { FilterSidebar } from "../components/FilterSideBar";
import { useMemo } from "react";
import { FiX } from "react-icons/fi";
import { ProductCard } from "../components/ProductCard";
import WheelPagination from "../components/WheelPagination";
import { useProductContext } from "../context/ProductContext";

const Collection = () => {
  const {
    filters,
    setFilters,
    filteredProducts,
    setFilteredProducts,
    products,
    handleFilters,
    handleFilterChange,
    handleSortChange,
  } = useProductContext();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  console.log("Current Page:", currentPage);
  console.log("Filtered:", filteredProducts.length);
  console.log("Current Products:", currentProducts.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="min-h-screen mt-2 pt-12">
      <CollectionHeader
        totalProducts={currentProducts.length}
        totalFilteredProducts={filteredProducts.length}
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        onToggleFilters={() => setIsMobileFilterOpen(true)}
        filters={filters}
        handleSortChange={handleSortChange}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                  onClick={() => setIsMobileFilterOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.div
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <div className="flex justify-between p-6 border-b">
                    <h2>Filters</h2>

                    <button onClick={() => setIsMobileFilterOpen(false)}>
                      <FiX />
                    </button>
                  </div>

                  <div className="p-4">
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}

          <div className="flex-1 mt-10 pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-12">
              {totalPages > 1 && (
                <WheelPagination
                  totalPages={totalPages}
                  visibleCount={5}
                  onChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
