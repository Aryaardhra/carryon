import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/data/assets";
import BackgroundVideo from "../BackgroundVideo";
import { useAuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  
  const { isAdmin } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSeller(true);
  };

  useEffect(() => {
    if (isAdmin) {
      console.log(isAdmin);
      navigate("/admin");
    }
  }, [isAdmin]);

  return (
    !isAdmin && (
      <>
        <div className=" relative flex  justify-center  text-[#0a153599]   h-screen">
          <BackgroundVideo videoUrl={assets.bg_login} />
          <div className=" absolute flex flex-col mt-8 ">
            <img src={assets.logo} alt="" className="h-8 " />
            <p className="text-sm text-indigo-950">
              Porem ipsum dolor sit amet
            </p>
          </div>
          <div
            // onClick= {()=> setUserLogin(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 "
          >
            <form
              onSubmit={onSubmitHandler}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col gap-4 m-auto items-start p-8 py-6 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-transparent outline-1"
            >
              <p className="text-xl font-medium m-auto text-secondary/80">
                <span className="text-text">User</span>Login
              </p>
              <div className="w-full ">
                <p className="text-indigo-950 text-xs"> Enter Your Email</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="type here"
                  className="border border-gray-200 rounded  text-gray-900 w-full p-2 mt-1 outline-1 outline-primary bg-[oklch(0.76_0.02_321.96_/_0.5)] "
                  type="email"
                  required
                />
              </div>
              <div className="w-full ">
                <p className="text-indigo-950 text-xs"> Enter Your Password</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="type here"
                  className="border border-gray-200 rounded text-gray-900 w-full p-2 mt-1 outline-1 outline-primary bg-[oklch(0.76_0.02_321.96_/_0.5)]"
                  type="password"
                  required
                />
              </div>
              <button className="bg-primary/80 hover:bg-secondary/80 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                login
              </button>
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default AdminLogin;
