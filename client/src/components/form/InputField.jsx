const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <div className="w-full">
      {label && <p className="text-indigo-950 text-xs">{label}</p>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
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
                disabled:bg-gray-200
                disabled:cursor-not-allowed
                "
      />
    </div>
  );
};

export default InputField;
