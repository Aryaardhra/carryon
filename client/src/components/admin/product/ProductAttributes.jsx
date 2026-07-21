import DynamicList from "./DynamicList";
import SuitableFor from "./SuitableFor";

const ProductAttributes = ({ product, setProduct }) => {
  return (
    <div className="space-y-8">
      <DynamicList
        title="Highlights"
        placeholder="Lightweight"
        buttonText="+ Add Highlight"
        items={product.highlights}
        setItems={(items) =>
          setProduct((prev) => ({
            ...prev,
            highlights: items,
          }))
        }
      />

      <DynamicList
        title="Tags"
        placeholder="Travel"
        buttonText="+ Add Tag"
        items={product.tags}
        setItems={(items) =>
          setProduct((prev) => ({
            ...prev,
            tags: items,
          }))
        }
      />

      <SuitableFor product={product} setProduct={setProduct} />
    </div>
  );
};

export default ProductAttributes;
