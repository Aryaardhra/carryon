import { IoTrashBinSharp } from "react-icons/io5";
import FormField from "../FormField";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const VariantOptionCard = ({ option, index, updateOption, removeOption }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Size Option {index + 1}</h4>

        <button type="button" onClick={() => removeOption(index)}>
          <IoTrashBinSharp
            size={20}
            className="text-red-500 hover:text-red-700"
          />
        </button>
      </div>

      {/* Size */}

      <div>
        <label className="text-sm font-medium">Size</label>

        <select
          value={option.size}
          onChange={(e) => updateOption(index, "size", e.target.value)}
          className="mt-1 w-full border rounded-md p-2"
        >
          <option value="">Select Size</option>

          {SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}

      <FormField
        label="Price"
        type="number"
        value={option.price}
        onChange={(e) => updateOption(index, "price", e.target.value)}
      />

      {/* Sale Price */}

      <FormField
        label="Sale Price"
        type="number"
        value={option.salePrice}
        onChange={(e) => updateOption(index, "salePrice", e.target.value)}
      />

      {/* Stock */}

      <FormField
        label="Stock"
        type="number"
        value={option.stock}
        onChange={(e) => updateOption(index, "stock", e.target.value)}
      />
    </div>
  );
};

export default VariantOptionCard;
