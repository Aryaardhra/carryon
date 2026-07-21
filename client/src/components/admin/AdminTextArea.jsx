const AdminTextarea = ({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-base font-medium">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="outline-none rounded border border-gray-300 px-3 py-2.5 resize-none"
      />
    </div>
  );
};

export default AdminTextarea;