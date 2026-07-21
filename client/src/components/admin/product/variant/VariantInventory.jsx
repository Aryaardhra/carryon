import FormField from "../../FormField";

const VariantInventory = ({ variant, updateOption }) => {
  return (
    <div className="space-y-4">
      {variant.options.map((option, optionIndex) => (
        <div key={optionIndex} className="border rounded-lg p-4">
          <div className="mb-3">
            <h4 className="font-medium text-gray-700">
              Size : {option.size || "Not Selected"}
            </h4>
          </div>

          <FormField
            label="Stock"
            type="number"
            value={option.stock}
            onChange={(e) => updateOption(optionIndex, "stock", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default VariantInventory;
