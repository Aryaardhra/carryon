import { assets } from "../assets/data/assets";
import BackgroundVideo from "../components/BackgroundVideo";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="relative flex justify-center h-screen text-[#0a153599]">
      <BackgroundVideo videoUrl={assets.bg_login} />

      <div className="absolute flex flex-col mt-8 z-20">
        <img src={assets.logo} alt="CarryOn" className="h-8" />

        <p className="text-sm text-indigo-950">Porem ipsum dolor sit amet</p>
      </div>

      <div className="relative z-20 flex items-center justify-center h-screen">
        <div
          className="flex flex-col gap-4
                    p-8 py-6
                    w-80
                    sm:w-[352px]
                    rounded-lg
                    shadow-xl
                    border
                    border-gray-200
                    bg-transparent
                    outline-1"
        >
          <h2 className="text-xl text-center font-medium text-secondary/80">
            {title}
          </h2>
          {subtitle && (
            <p className="text-center text-xs text-gray-300">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
