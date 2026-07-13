import { Link } from "react-router-dom";

const SwitchLink = ({ text, linkText, to }) => {
  return (
    <p className="text-center text-xs text-gray-300">
      {text}

      <Link to={to} className="ml-1 text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
};

export default SwitchLink;
