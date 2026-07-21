const AdminSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-base font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="outline-none rounded border border-gray-300 px-3 py-2.5"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((item, index) => (
          <option
            key={index}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AdminSelect;