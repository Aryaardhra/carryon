import React from 'react'
import { assets } from '../assets/data/assets';
import Carousel from './Carousel';

const slides = [
  {
    src: assets.c_img,
    title: "Summer Sale",
    description: "Up to 50% off on all items",
    type: "image",
  },
  {
    src: assets.c_img2,
    title: "New Arrivals",
    description: "Check out the latest trends",
    type: "image",
  },
  {
    src: assets.v_bag,
    title: "Exclusive Video",
    description: "Discover our new collection",
    type: "video",
  },
];

const Banner = () => {
  return (
    <>
     <div className="relative w-full overflow-hidden">
      <Carousel autoSlide={true} autoSlideInterval={4000}>
        {slides.map((slide, index) => (
          <>
          <div key={index} className="relative w-full h-[460px] overflow-hidden">
            {slide.type === "image" ? (
              <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
            ) : (
              <video src={slide.src} autoPlay muted loop className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-40 left-20  bg-opacity-50 text-black p-4 rounded">
              <h2 className="text-2xl font-bold text-secondary">{slide.title}</h2>
              <p className="mt-2 text-secondary/70">{slide.description}</p>
            </div>
            </div>
            </>
        ))}
      
      </Carousel>
    </div>
    </>
  )
}

export default Banner