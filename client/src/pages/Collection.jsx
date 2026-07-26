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
    products,
    filters,
    handleFilterChange,
    handleSortChange,
    page,
    setPage,
    pagination,
    loading,
  } = useProductContext();
 
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen mt-2 pt-12">
      <CollectionHeader
        totalProducts={products.length}
        totalFilteredProducts={pagination.totalProducts}
        currentPage={pagination.currentPage}
        productsPerPage={pagination.limit}
        onToggleFilters={() => setIsMobileFilterOpen(true)}
        filters={filters}
        handleSortChange={handleSortChange}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter */}
          <div className="hidden lg:block lg:w-64">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile Filter */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                />

                <motion.div
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>

                    <button onClick={() => setIsMobileFilterOpen(false)}>
                      <FiX size={22} />
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

          {/* Products */}
          <div className="flex-1 mt-10 pt-10">
            {loading ? (
              <div className="text-center py-20">Loading products...</div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    No products found.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    <div className="flex justify-center mt-12">
                      {pagination.totalPages > 1 && (
                        <WheelPagination
                          totalPages={pagination.totalPages}
                          visibleCount={5}
                          currentPage={page}
                          onChange={handlePageChange}
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
