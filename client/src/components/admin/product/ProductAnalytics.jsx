import { FaBoxOpen, FaStar } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { PiCurrencyDollarBold } from "react-icons/pi";

const Card = ({ title, value, icon }) => (
  <div className="border rounded-xl p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
    <div className="text-primary text-3xl">{icon}</div>
  </div>
);

const ProductAnalytics = ({ product }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-6">Product Analytics</h2>

      <div className="grid md:grid-cols-3 gap-5">
        <Card
          title="Average Rating"
          value={product.averageRating ?? 0}
          icon={<FaStar />}
        />

        <Card
          title="Total Reviews"
          value={product.totalReviews ?? 0}
          icon={<MdReviews />}
        />

        <Card
          title="Total Stock"
          value={product.totalStock ?? 0}
          icon={<FaBoxOpen />}
        />

        <Card
          title="Minimum Price"
          value={`₹${product.minPrice ?? 0}`}
          icon={<PiCurrencyDollarBold />}
        />

        <Card
          title="Maximum Price"
          value={`₹${product.maxPrice ?? 0}`}
          icon={<PiCurrencyDollarBold />}
        />

        <Card
          title="Availability"
          value={product.inStock ? "In Stock" : "Out of Stock"}
          icon={<FaBoxOpen />}
        />
      </div>
    </div>
  );
};

export default ProductAnalytics;
