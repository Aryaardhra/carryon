const AdminHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-semibold text-secondary">{title}</h1>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="bg-primary hover:bg-secondary transition text-white px-6 py-2 rounded-md"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default AdminHeader;
