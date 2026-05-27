import React from "react";
import Title from "./Title";

const NewsLetter = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
        <div>
          <Title title="NEWSLETTER" />
        </div>
        <p className="md:text-sm font-lora font-semibold text-secondary/80 pb-6">
          Sign up to our newsletter to receive exclusive offers.
        </p>
        <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12 gap-3">
          <input
            className="border border-gray-400 bg-gray-400/15 rounded-md h-full  outline-none w-full  px-3 text-gray-800/70"
            type="text"
            placeholder="Enter your email id"
            required
          />
          <button
            type="submit"
            className="md:px-12 px-8 h-full text-secondary bg-transparent border border-[#bab3b3] hover:bg-[#bab3b3] transition-all cursor-pointer rounded-md "
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </>
  );
};

export default NewsLetter;
