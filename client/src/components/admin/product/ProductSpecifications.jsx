import { IoTrashBinSharp } from "react-icons/io5";
import AdminButton from "../AdminButton";
import FormField from "../FormField";

const ProductSpecifications = ({ product, setProduct }) => {
  const addSpecification = () => {
    console.log(product.specifications);
    setProduct((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          key: "",
          value: "",
        },
      ],
    }));
  };

  const removeSpecification = (index) => {
    const updated = [...product.specifications];
    updated.splice(index, 1);
    setProduct((prev) => ({
      ...prev,
      specifications: updated,
    }));
  };

  const updateSpecification = (index, field, value) => {
    console.log("Typing:", index, field, value);
    const updated = product.specifications.map((spec, i) =>
      i === index
        ? {
            ...spec,
            [field]: value,
          }
        : spec,
    );
    setProduct((prev) => ({
      ...prev,
      specifications: updated,
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Specifications</h2>

        <AdminButton type="button" onClick={addSpecification}>
          + Add Specification
        </AdminButton>
      </div>

      {product.specifications.length === 0 && (
        <div className="text-sm text-gray-500 border border-dashed rounded-lg p-6 text-center">
          No specifications added.
        </div>
      )}

      <div className="space-y-5">
        {product?.specifications?.map((specification, index) => (
          <div
            key={index}
            className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end border rounded-lg p-4"
          >
            <FormField
              label="Key"
              placeholder="Material"
              value={specification.key}
              onChange={(e) =>
                updateSpecification(index, "key", e.target.value)
              }
            />

            <FormField
              label="Value"
              placeholder="Polycarbonate"
              value={specification.value}
              onChange={(e) =>
                updateSpecification(index, "value", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => removeSpecification(index)}
              className="pb-2"
            >
              <IoTrashBinSharp
                size={22}
                className="text-red-500 hover:text-red-700"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;
