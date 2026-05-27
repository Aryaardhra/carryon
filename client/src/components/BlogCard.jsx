import React from "react";
import { assets } from "../assets/data/assets";

const BlogCard = ({ blogs }) => {
  return (
    <>
      {blogs.map((item) => (
        <div
          key={item._id}
          className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:scale-105 transition-all duration-350"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div>
            <p className="text-xl text-secondary/70 font-medium font-inknut absolute top-4">
              {item.title}
            </p>
            <p className="text-sm text-secondary/65 font-medium font-lora">
              {item.details}
            </p>
          </div>
          <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5 text-secondary/65">
            Read more...
            <img
              src={assets.right_arrow}
              alt="arrow_icon"
              className="invert group-hover:translate-x-1 transition-all"
            />
          </button>
        </div>
      ))}
    </>
  );
};

export default BlogCard;
