import VariantCard from "./VariantCard";
import AdminButton from "../AdminButton";

const emptyOption = {
  size: "",
  stock: 0,
  price: "",
  salePrice: "",
};

const emptyVariant = {
  sku: "",
  color: {
    name: "",
    hex: "#000000",
  },
  images: [],
  options: [structuredClone(emptyOption)],
};

const ProductVariants = ({ product, setProduct }) => {
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, structuredClone(emptyVariant)],
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
    const updated = [...product.variants];
    updated.splice(index, 1);
    setProduct({
      ...product,
      variants: updated,
    });
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
            key={index}
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
