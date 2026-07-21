import { IoTrashBinSharp } from "react-icons/io5";
import ImageUpload from "../ImageUpload";
import FormField from "../FormField";
import VariantImages from "./variant/VariantImages";
import VariantBasicInfo from "./variant/VariantBasicInfo";
import VariantPricing from "./variant/VariantPricing";
import VariantInventory from "./variant/VariantInventory";
import VariantOptionCard from "./VariantOptionCard";
import AdminButton from "../AdminButton";

const VariantCard = ({ index, variant, updateVariant, removeVariant }) => {
  /* ---------- Update SKU ---------- */

  const updateField = (field, value) => {
    updateVariant(index, {
      ...variant,
      [field]: value,
    });
  };

  /* ---------- Update Color ---------- */

  const updateColor = (color) => {
    updateVariant(index, {
      ...variant,
      color,
    });
  };

  /* ---------- Update Size Option ---------- */

  const updateOption = (optionIndex, field, value) => {
    const updatedOptions = variant.options.map((option, i) =>
      i === optionIndex
        ? {
            ...option,
            [field]: value,
          }
        : option,
    );

    updateVariant(index, {
      ...variant,
      options: updatedOptions,
    });
  };

  /* ---------- Add Size ---------- */

  const addOption = () => {
    updateVariant(index, {
      ...variant,

      options: [
        ...variant.options,

        {
          size: "",
          stock: 0,
          price: "",
          salePrice: "",
        },
      ],
    });
  };

  /* ---------- Remove Size ---------- */

  const removeOption = (optionIndex) => {
    const updatedOptions = variant.options.filter((_, i) => i !== optionIndex);

    updateVariant(index, {
      ...variant,
      options: updatedOptions,
    });
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Variant {index + 1}</h3>

        <button type="button" onClick={() => removeVariant(index)}>
          <IoTrashBinSharp
            size={20}
            className="text-red-500 hover:text-red-700"
          />
        </button>
      </div>

      {/* Images */}

      <VariantImages
        index={index}
        variant={variant}
        updateField={updateField}
      />

      {/* SKU + Color */}

      <VariantBasicInfo
        variant={variant}
        updateField={updateField}
        updateColor={updateColor}
      />

      {/* Size Options */}

      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Size Options</h4>

          <AdminButton type="button" onClick={addOption}>
            + Add Size
          </AdminButton>
        </div>

        {variant.options.map((option, optionIndex) => (
          <VariantOptionCard
            key={optionIndex}
            option={option}
            index={optionIndex}
            updateOption={updateOption}
            removeOption={removeOption}
          />
        ))}
      </div>
    </div>
  );
};

export default VariantCard;
