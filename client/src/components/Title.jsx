import React from 'react'

const Title = ({ title, subTitle, align, font, size}) => {
  return (
    <>
        <div className={`flex flex-col justify-center items-center text-center ${align === "left" && "md:items-start md:text-left"}`}>
        <h1 className={` ${font || "font-heading"} ${ size ||" text-[34px] md:text-[32px] "} text-secondary bg-clip-text font-semibold`}>{title}</h1>
        <p className=" font-paragraph font-medium text-xl md:text-base text-[#353436] mt-2 max-w-174">{subTitle}</p>
    </div>
    </>
  )
}

export default Title