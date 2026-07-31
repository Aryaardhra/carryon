import VariantCard from "./VariantCard";
import AdminButton from "../AdminButton";

const emptyVariant = () => ({
  
  tempId: crypto.randomUUID(),

  sku: "",

  color: {
    name: "",
    hex: "#000000",
  },

  images: [],

  options: [
    {
      size: "",
      stock: 0,
      price: "",
      salePrice: "",
    },
  ],

  isActive: true,
});

const ProductVariants = ({ product, setProduct }) => {
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  const updateVariant = (index, updatedVariant) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? updatedVariant : variant,
      ),
    }));
  };

  const removeVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Product Variants</h2>

        <AdminButton type="button" onClick={addVariant}>
          + Add Variant
        </AdminButton>
      </div>

      <div className="space-y-8">
        {product.variants.map((variant, index) => (
          <VariantCard
            key={variant._id || variant.tempId}
            index={index}
            variant={variant}
            updateVariant={updateVariant}
            removeVariant={removeVariant}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductVariants;
