import React, { useState } from 'react'
import Title from './Title';
import { ProductCard } from './ProductCard';
import { useProductContext } from '../context/ProductContext';

const RelatedProduct = ({ products }) => {
  return (
    <>
      <div>
        <Title
          title="Related Collections"
          subTitle="You may also like these products"
          className="font-outfit"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </>
  );
};

export default RelatedProduct;