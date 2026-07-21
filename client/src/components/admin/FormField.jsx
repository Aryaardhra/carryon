const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  options = [],
  required = false,
  disabled = false,
  rows = 4,
  className = "",
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-secondary">{label}</label>
      )}

      {/* Input */}
      {(type === "text" ||
        type === "number" ||
        type === "email" ||
        type === "password") && (
        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-md border border-gray-300
          px-4 py-3 outline-none
          focus:ring-2 focus:ring-primary
          disabled:bg-gray-100
          ${className}`}
        />
      )}

      {/* Textarea */}
      {type === "textarea" && (
        <textarea
          rows={rows}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-md border border-gray-300
          px-4 py-3 outline-none resize-none
          focus:ring-2 focus:ring-primary
          disabled:bg-gray-100
          ${className}`}
        />
      )}

      {/* Select */}
      {type === "select" && (
        <select
          value={value ?? ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full rounded-md border border-gray-300
          px-4 py-3 outline-none
          focus:ring-2 focus:ring-primary
          disabled:bg-gray-100
          ${className}`}
        >
          <option value="">Select</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Checkbox */}
      {type === "checkbox" && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={value} onChange={onChange} />

          <span>{placeholder}</span>
        </label>
      )}
    </div>
  );
};

export default FormField;
