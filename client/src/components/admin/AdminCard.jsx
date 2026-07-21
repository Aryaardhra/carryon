const AdminCard = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default AdminCard;