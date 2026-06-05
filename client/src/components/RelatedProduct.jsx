import React, { useState } from 'react'
import Title from './Title';
import { ProductCard } from './ProductCard';
import { useProductContext } from '../context/ProductContext';

const RelatedProduct = () => {

  const {products} = useProductContext();
  const initialCount = 4;
  const [showExtra, setShowExtra] = useState(false); // toggle for extra 4

  /*const handleToggle = () => {
    setShowExtra(prev => !prev); // toggle state
  };*/

  const visibleProducts = showExtra
    ? products.slice(0, initialCount + 4) // show 0-7 (8 total)
    : products.slice(0, initialCount);   // show 0-3 (4 only)

  return (
    <>
    <div>
        <Title 
        title="Related Collections" 
        subTitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
        className="font-outfit"
        />
    </div>
    <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
        <ProductCard products={visibleProducts} />
    </div>

    </>
  )
}

export default RelatedProduct