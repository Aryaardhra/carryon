const AdminButton = ({
  children,
  loading = false,
  type = "submit",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className="px-8 py-2.5 rounded bg-primary text-white hover:bg-secondary transition"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AdminButton;