const Button = ({ loading, loadingText, children }) => {
  return (
    <button
      disabled={loading}
      className={`
      w-full
      py-2
      rounded-md
      text-white
      transition-all
      ${
        loading
          ? "bg-primary/50 cursor-not-allowed"
          : "bg-primary/80 hover:bg-secondary/80"
      }
      `}
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default Button;
