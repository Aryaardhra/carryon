import React, { useEffect, useState } from "react";
import Title from "./Title";
import { ProductCard } from "./ProductCard";
import { useProductContext } from "../context/ProductContext";

const LatestCollection = () => {
  const { products } = useProductContext();
  const [stopScroll, setStopScroll] = useState(false);
  const [latestSeller, setLatestSeller] = useState([]);

  const latestProducts = () => {
    const latestProduct = products.filter((item) => item.latestSeller);
    setLatestSeller(latestProduct);
  };

  useEffect(() => {
    latestProducts();
  }, []);

  return (
    <>
      <div>
        <Title
          title="LATEST SELLERS"
          subTitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
          className="font-outfit"
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-white py-20 gap-34 mt-10">
        <div
          className="overflow-hidden w-full relative max-w-6xl mx-auto"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          <div
            className="marquee-inner flex w-fit gap-6"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: latestSeller.length * 2500 + "ms",
            }}
          >
            {latestSeller.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}

            <div
              className="flex justify-center
              group relative shrink-0
              h-[240px] w-[260px]
              max-w-sm overflow-hidden rounded-3xl
              shadow-2xl transition-all duration-500 ease-in-out
              hover:-translate-y-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            >
              <h4 className="flex mt-20 text-2xl font-medium">Shop Now</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestCollection;
