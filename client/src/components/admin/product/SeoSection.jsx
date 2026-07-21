import AdminTextarea from "../AdminTextArea";
import FormField from "../FormField";
import DynamicList from "./DynamicList";

const SeoSection = ({ product, setProduct }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">SEO</h2>

      <div className="space-y-6">
        <FormField
          label="Meta Title"
          placeholder="Travel Suitcase"
          value={product.seo.metaTitle}
          onChange={(e) =>
            setProduct({
              ...product,
              seo: {
                ...product.seo,
                metaTitle: e.target.value,
              },
            })
          }
        />

        <AdminTextarea
          label="Meta Description"
          placeholder="Enter meta description..."
          value={product.seo.metaDescription}
          rows={4}
          onChange={(e) =>
            setProduct({
              ...product,
              seo: {
                ...product.seo,
                metaDescription: e.target.value,
              },
            })
          }
        />

        <DynamicList
          title="SEO Keywords"
          placeholder="Suitcase"
          buttonText="+ Add Keyword"
          items={product.seo.keywords}
          setItems={(items) =>
            setProduct({
              ...product,
              seo: {
                ...product.seo,
                keywords: items,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default SeoSection;
