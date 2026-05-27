import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WheelPagination({
  totalPages = 10,
  visibleCount = 5,
  onChange,
}) {
  const [active, setActive] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    if (onChange) {
      onChange(active + 1);
    }
  }, [active]);

  const prevPage = () => {
    setActive((prev) => Math.max(prev - 1, 0));
  };

  const nextPage = () => {
    setActive((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleWheel = (e) => {
    e.preventDefault();

    if (e.deltaY > 0) {
      nextPage();
    } else {
      prevPage();
    }
  };

  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    el.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const getVisiblePages = () => {
    const pages = [];

    const half = Math.floor(visibleCount / 2);

    let start = active - half;
    let end = active + half;

    if (start < 0) {
      end += -start;
      start = 0;
    }

    if (end > totalPages - 1) {
      start -= end - (totalPages - 1);
      end = totalPages - 1;

      if (start < 0) start = 0;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-3 mt-20 select-none"
    >
      {/* Previous */}
      <button
        onClick={prevPage}
        disabled={active === 0}
        className="
          flex h-10 w-10 items-center justify-center rounded-full
          border border-gray-300 bg-white text-gray-700
          transition-all duration-300
          hover:bg-black hover:text-white
          disabled:opacity-40
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Pagination Numbers */}
      <div className="flex items-center gap-3">
        {visiblePages.map((page) => (
          <motion.button
            key={page}
            layout
            onClick={() => setActive(page)}
            animate={{
              scale: active === page ? 1.15 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={`
              flex h-11 w-11 items-center justify-center rounded-full
              text-sm font-medium transition-all duration-300
              ${
                active === page
                  ? "bg-black text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {page + 1}
          </motion.button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={nextPage}
        disabled={active === totalPages - 1}
        className="flex h-10 w-10 items-center justify-center rounded-full
        border border-gray-300 bg-white text-gray-700 transition-all duration-300
        hover:bg-black hover:text-white disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}