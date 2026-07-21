import { COLORS } from "../../../../constants/colors";
import FormField from "../../FormField";

const VariantBasicInfo = ({ variant, updateField, updateColor }) => {
  
  const handleColorChange = (colorName) => {
    const selectedColor = COLORS.find((color) => color.name === colorName);
    if (!selectedColor) return;
    updateColor(selectedColor);
  };

  return (
    <div className="space-y-6">

      {/* SKU */}

      <div>
        <label className="text-sm font-medium">SKU</label>
        <input
          value={variant.sku}
          onChange={(e) => updateField("sku", e.target.value)}
          className="mt-1 w-full border rounded-md p-2"
        />
      </div>

      {/* Color */}

      <div>
        <label className="text-sm font-medium">Color</label>

        <select
          value={variant.color.name}
          onChange={(e) => handleColorChange(e.target.value)}
          className="mt-1 w-full border rounded-md p-2"
        >
          <option value="">Select Color</option>

          {COLORS.map((color) => (
            <option key={color.name} value={color.name}>
              {color.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Color */}

      <div>
        <label className="text-sm font-medium">Selected Color</label>

        <div className="mt-2 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border"
            style={{
              background: variant.color.hex,
            }}
          />

          <span className="text-gray-600">
            {variant.color.name || "No Color"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VariantBasicInfo;
