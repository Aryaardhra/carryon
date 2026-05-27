import React from 'react'
import { assets } from '../assets/data/assets'

const ServicesBanner = () => {
  return (
    <>
     <section className="flex flex-row mt-10 justify-evenly items-center m-8 gap-8 font-lora">
      <div className="flex flex-col justify-center items-center bg-[#504D5D]/10 rounded-[8px_8px_8px_8px] pb-4 pt-4">
            <span className="rounded-full bg-[#afb0b5]/60"><img src ={assets.exchange} alt="exchange" className=" h-5.4 " /></span>
         <h5 className="pt-2 md:pl-6 text-md text-gray-950 font-semibold font-lora">Easy Exchange Policy</h5>
         <p className="pl-4 md:pl-8 pt-2 text-gray-800 text-sm font-medium ">Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem.</p>
      </div>
       <div className="flex flex-col justify-center items-center bg-[#504D5D]/10 rounded-[8px_8px_8px_8px] pb-4 pt-4">
            <span className="rounded-full bg-[#afb0b5]/60"><img src ={assets.trunk} alt="trunk" className=" h-5.4 " /></span>
         <h5 className="pt-2 pl-6 text-md text-gray-950 font-semibold">7 Days Return Policy</h5>
         <p className="pl-6 pt-2 text-gray-800 text-sm font-medium">Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem.</p>
      </div>
       <div className="flex flex-col justify-center items-center bg-[#504D5D]/10 rounded-[8px_8px_8px_8px] pb-4 pt-4">
            <span className="rounded-full bg-[#afb0b5]/60"><img src ={assets.customer} alt="customer" className=" h-5.4 " /></span>
         <h5 className="pt-2 pl-6 text-md text-gray-950 font-semibold">Best Customer Support</h5>
         <p className="pl-6 pt-2 text-gray-800 text-sm font-medium">Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem.</p>
      </div>
    </section>
    </>
  )
}

export default ServicesBanner