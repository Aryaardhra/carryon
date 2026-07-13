const InputField = ({label, type = "text", value, onChange, placeholder, required = true, }) => {
  return (
    <div className="w-full">
      <p className="text-indigo-950 text-xs">{label}</p>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="
        mt-1
        w-full
        rounded
        border
        border-gray-200
        p-2
        text-gray-900
        outline-1
        outline-primary
        bg-[oklch(0.76_0.02_321.96_/_0.5)]
        "
      />
    </div>
  );
};

export default InputField;
