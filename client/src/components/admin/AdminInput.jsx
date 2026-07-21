const AdminInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-base font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="outline-none rounded border border-gray-300 px-3 py-2.5"
      />
    </div>
  );
};

export default AdminInput;