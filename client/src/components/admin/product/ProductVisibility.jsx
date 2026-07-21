const ProductVisibility = ({ product, setProduct }) => {
  const toggle = (field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Product Visibility</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={product.bestSeller}
            onChange={() => toggle("bestSeller")}
          />
          Best Seller
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={product.latest}
            onChange={() => toggle("latest")}
          />
          Latest Arrival
        </label>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Product Status</label>

        <select
          value={product.status}
          onChange={(e) =>
            setProduct((prev) => ({
              ...prev,
              status: e.target.value,
            }))
          }
          className="border rounded-md p-2 w-full"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
};

export default ProductVisibility;
