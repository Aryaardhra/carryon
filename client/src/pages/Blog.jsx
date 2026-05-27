import { useEffect, useState } from "react";

import { demoblogs } from "../assets/data/assets";
import BlogCards from "../components/BlogCards";
import Title from "../components/Title";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setBlogs(demoblogs);
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-[#0a153599] bg-[url(https://images.unsplash.com/photo-1709120187424-50ad0d250f6e?q=80&w=1279&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-no-repeat bg-cover bg-center h-[380px] mt-19">
        <div className="absolute flex flex-col items-start md:items-end mt-20">
          <h1 className="font-inknut text-xl md:text-[28px] font-semibold bg-gradient-to-b from-violet-800 via-violet-950 to-orange-950 bg-clip-text text-transparent">
            Discover Your Perfect Satchel
          </h1>

          <p className="font-lora max-w-110 mt-2 text-sm md:text-base py-2 pr-8">
            Nunc vulputate libero et velit interdum.
          </p>
        </div>
      </div>

      <div className="mt-8 ">
        <Title
       // title="Latest Collections" 
        subTitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
        className="font-outfit"
        />
    </div>

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-20 px-6 md:px-16">
        {blogs.map((blog) => (
          <BlogCards key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  );
};

export default Blog;