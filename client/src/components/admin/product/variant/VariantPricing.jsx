import FormField from "../../FormField";

const VariantPricing = ({ variant, updateOption }) => {
  return (
    <div className="space-y-4">
      {variant.options.map((option, optionIndex) => (
        <div
          key={optionIndex}
          className="grid md:grid-cols-2 gap-4 border rounded-lg p-4"
        >
          <div className="md:col-span-2">
            <h4 className="font-medium text-gray-700">
              Size : {option.size || "Not Selected"}
            </h4>
          </div>

          <FormField
            label="Price"
            type="number"
            value={option.price}
            onChange={(e) => updateOption(optionIndex, "price", e.target.value)}
          />

          <FormField
            label="Sale Price"
            type="number"
            value={option.salePrice}
            onChange={(e) =>
              updateOption(optionIndex, "salePrice", e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default VariantPricing;
