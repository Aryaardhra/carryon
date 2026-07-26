import React, { useEffect, useState } from "react";
import { useProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { categories } from "../assets/data/assets";
import { getProducts } from "../services/productService";
import { getCategoryById } from "../services/categoryService";

const ProductCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [id]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      const [productRes, categoryRes] = await Promise.all([
        getProducts({
          category: id,
        }),
        getCategoryById(id),
      ]);

      setProducts(productRes.data.products);

      setCategory(categoryRes.data.category);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-24 ml-8">
      {category && (
        <div className="flex flex-col items-start w-max mb-6">
          <p className="text-2xl font-medium uppercase">{category.name}</p>

          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
