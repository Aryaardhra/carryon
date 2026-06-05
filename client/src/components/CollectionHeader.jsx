import { FiGrid, FiList, FiFilter } from "react-icons/fi";

export function CollectionHeader({
  totalProducts,
  totalFilteredProducts,
  currentPage,
  productsPerPage,
  onToggleFilters,
  filters,
  handleSortChange,
}) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center mb-4 mt-0">
          <div>
            <h1 className="text-3xl mb-1 text-secondary pt-6">
              Handbag Bestsellers
            </h1>
            <p className="text-gray-600">Discover our most-loved handbags</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * productsPerPage + 1}-
            {Math.min(currentPage * productsPerPage, totalFilteredProducts)} of{" "}
            {totalFilteredProducts} products
          </p>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={onToggleFilters}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded bg-white"
            >
              <option value="">Featured</option>
              <option value="bestSeller">Best Seller</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="latestSeller">Latest Collection</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
