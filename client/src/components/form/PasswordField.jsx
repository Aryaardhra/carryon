import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  value,
  onChange,
  placeholder,
  name,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded border border-gray-200
                bg-[oklch(0.76_0.02_321.96_/_0.5)]
                p-3
                pr-12
                outline-1
                outline-primary"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-600"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordField;
