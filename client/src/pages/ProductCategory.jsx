import React from "react";
import { useProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { categories } from "../assets/data/assets";

const ProductCategory = () => {
  const { products } = useProductContext();
  const { category } = useParams();
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category,
  );
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category,
  );
  return (
    <>
      <div className="mt-24 ml-8">
        {searchCategory && (
          <div className="flex flex-col items-end w-max">
            <p className="text-2xl font-medium">
              {searchCategory.text.toUpperCase()}
            </p>
            <div className="w-16 h-0 5 bg-primary rounded-full"></div>
          </div>
        )}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-32 mt-6 ">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          //if there is no category found
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-2xl font-medium text-primary">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCategory;
