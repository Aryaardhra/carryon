import React, { useState } from 'react'
import { assets } from '../assets/data/assets';
import BackgroundVideo from '../components/BackgroundVideo';

const Login = () => {

  const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const onSubmitHandler = async (e) => {
       
        e.preventDefault();
   
    }
  return (
    <>
     <div className= " relative flex  justify-center  text-[#0a153599]   h-screen">
      <BackgroundVideo videoUrl={assets.bg_login}/>
     <div className=" absolute flex flex-col mt-8 ">
      <img src={assets.logo} alt="" className="h-8 " />
      <p className="text-sm text-indigo-950">Porem ipsum dolor sit amet</p>
     </div>
          <div 
         // onClick= {()=> setUserLogin(false)} 
          className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 ">
         <form onSubmit={onSubmitHandler} onClick={(e)=> e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-6 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-transparent outline-1">
            <p className="text-xl font-medium m-auto text-secondary/80">
                <span className="text-text">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p className="text-indigo-950 text-xs">Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded text-gray-900 w-full p-2 mt-1 outline-1 outline-primary bg-[oklch(0.76_0.02_321.96_/_0.5)]" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p className="text-indigo-950 text-xs"> Enter Your Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded  text-gray-900 w-full p-2 mt-1 outline-1 outline-primary bg-[oklch(0.76_0.02_321.96_/_0.5)] " type="email" required />
            </div>
            <div className="w-full ">
                <p className="text-indigo-950 text-xs"> Enter Your Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded text-gray-900 w-full p-2 mt-1 outline-1 outline-primary bg-[oklch(0.76_0.02_321.96_/_0.5)]" type="password" required />
            </div>
            {state === "register" ? (
                <p className="text-gray-300 text-xs">
                    Already have account? <span onClick={() => setState("login")} className="text-gray-300 cursor-pointer">click here</span>
                </p>
            ) : (
                <p className="text-gray-300 text-xs">
                    Create an account? <span onClick={() => setState("register")} className="text-gray-300 cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-primary/80 hover:bg-secondary/80 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
     </div>
    </>
  )
}

export default Login