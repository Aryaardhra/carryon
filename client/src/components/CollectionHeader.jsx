import { FiGrid, FiList, FiFilter } from "react-icons/fi";

export function CollectionHeader({ totalProducts, onToggleFilters }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center mb-4 mt-0">
          <div>
            <h1 className="text-3xl mb-1 text-secondary">
              Handbag Bestsellers
            </h1>
            <p className="text-gray-600">Discover our most-loved handbags</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{totalProducts} Products</p>

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
            <select className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <option>Featured</option>
              <option>Best Selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
