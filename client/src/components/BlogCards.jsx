import { motion } from "framer-motion";
import { demoblogs } from "../assets/data/assets";

const BlogCards = ({ blog }) => {
  return (
    <motion.article
      className="bg-white rounded-xl overflow-hidden shadow-sm w-[320px] h-[380px]"
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.25 }}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />

        {/* Category Badge */}
        <span className="absolute bottom-3 left-3 bg-[#130944] text-white text-xs px-3 py-1 rounded-md">
          {blog.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-[#130944] leading-snug">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
          {blog.description}
        </p>

        <p className="text-gray-400 text-sm mt-2">
          {blog.date}
        </p>

        <button className="mt-2 text-[#3A0D08] font-medium text-sm hover:underline">
          Read More →
        </button>
      </div>
    </motion.article>
  );
};

export default BlogCards;