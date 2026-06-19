import { createContext, useContext, useEffect, useState } from "react";
import { dummyProducts } from "../assets/data/assets";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
  const [filters, setFilters] = useState({
    category: [],
    color: [],
    sizes: [],
    material: [],
    price: [],
    sortBy: "",
  });

  const priceRange = [
    { label: "Below ₹500", min: 0, max: 500 },
    { label: "₹500-₹2500", min: 500, max: 2500 },
    { label: "₹2500-₹4500", min: 2500, max: 4500 },
    { label: "Above ₹4500", min: 4500, max: Infinity },
  ];

  const handleFilters = () => {
    let tempProducts = [...products];

    // Search Filter
    if (searchQuery.length > 0) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.material.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category
    if (filters.category.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        filters.category.includes(product.category),
      );
    }

    // Color
    if (filters.color.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        product.color.some((clr) => filters.color.includes(clr)),
      );
    }

    // Sizes
    if (filters.sizes.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size)),
      );
    }

    // Materials
    if (filters.material.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        filters.material.includes(product.material),
      );
    }

    const isPriceInSelectedRange = (price) => {
      const numericPrice = Number(price);

      return filters.price.some((selectedRange) => {
        const range = priceRange.find((item) => item.label === selectedRange);

        return range && numericPrice >= range.min && numericPrice <= range.max;
      });
    };

    if (filters.price.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        isPriceInSelectedRange(product.price),
      );
    }

    // sorting

    switch (filters.sortBy) {
      case "low-high":
        tempProducts.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        tempProducts.sort((a, b) => b.price - a.price);
        break;

      case "bestSeller":
        tempProducts.sort((a, b) => b.bestSeller - a.bestSeller);
        break;

      case "latestSeller":
        tempProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        break;

      default:
        break;
    }

    setFilteredProducts(tempProducts);
  };

  useEffect(() => {
    handleFilters();
  }, [filters, products, searchQuery]);

  const clearFilters = () => {
    setFilters({
      category: [],
      color: [],
      sizes: [],
      material: [],
      price: [],
      sortBy: "",
    });
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      };
    });
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  const value = {
    filters,
    setFilters,
    filteredProducts,
    setFilteredProducts,
    products,
    handleFilters,
    handleFilterChange,
    handleSortChange,
    clearFilters,
    searchQuery,
    setSearchQuery,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
