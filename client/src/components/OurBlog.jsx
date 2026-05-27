import React, { useEffect, useState } from "react";
import Title from "./Title";
import { demoblogs } from "../assets/data/assets";
import BlogCard from "./BlogCard";
import { assets } from "../assets/data/assets";

const OurBlog = () => {
  const [blogs, setblogs] = useState(demoblogs);

  useEffect(() => {
    setblogs(blogs.slice(0, 4));
  }, []);

  return (
    <>
      <div className="flex flex-col items-center px-6 md:px-8 lg:px-20 xl:px-24  pt-8 pb-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <Title title="OUR BLOGS" align="left" />
          <button className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12">
            View All
            <img
              src={assets.right_arrow}
              alt="arrow_icon"
              className="group-hover:translate-x-1 transition-all"
            />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          <BlogCard blogs={blogs} />
        </div>
      </div>
    </>
  );
};

export default OurBlog;
