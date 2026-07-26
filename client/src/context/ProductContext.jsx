import { createContext, useContext, useEffect, useState } from "react";
import { getProductById, getProducts } from "../services/productService";
//import { dummyProducts } from "../assets/data/assets";
export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [filters, setFilters] = useState({
    category: [],
    color: [],
    sizes: [],
    material: [],
    price: [],
    sortBy: "",
  });

  let minPrice = "";
  let maxPrice = "";

  if (filters.price.includes("below500")) {
    minPrice = 0;
    maxPrice = 500;
  }

  if (filters.price.includes("500-2500")) {
    minPrice = 500;
    maxPrice = 2500;
  }

  if (filters.price.includes("2500-4500")) {
    minPrice = 2500;
    maxPrice = 4500;
  }

  if (filters.price.includes("4500+")) {
    minPrice = 4500;
  }
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts({
        page,
        limit,
        category: filters.category.join(","),
        color: filters.color.join(","),
        material: filters.material.join(","),
        search: searchQuery,
        sort: filters.sortBy,
        minPrice,
        maxPrice,
      });
      setProducts(data.products);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        limit: data.limit,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters, searchQuery]); // <-- NO products here

  const clearFilters = () => {
    setFilters({
      category: [],
      color: [],
      sizes: [],
      material: [],
      price: [],
      sortBy: "",
    });
    setPage(1);
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
    setPage(1);
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));

    setPage(1);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        filters,
        setFilters,
        page,
        setPage,
        pagination,
        handleFilterChange,
        handleSortChange,
        clearFilters,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
