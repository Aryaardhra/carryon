const options = ["men", "women", "unisex", "kids", "girls", "boys"];

const SuitableFor = ({ product, setProduct }) => {
  const toggleOption = (value) => {
    let updated;

    if (product.suitableFor.includes(value)) {
      updated = product.suitableFor.filter((item) => item !== value);
    } else {
      updated = [...product.suitableFor, value];
    }
    setProduct({
      ...product,
      suitableFor: updated,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Suitable For</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={product.suitableFor.includes(option)}
              onChange={() => toggleOption(option)}
            />

            <span className="capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SuitableFor;
