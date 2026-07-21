import FormField from "../FormField";

const BasicInformation = ({ product, setProduct, categories }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h3 className="text-lg font-semibold text-secondary">
        Basic Information
      </h3>

      <FormField
        label="Product Name"
        type="text"
        value={product.name}
        onChange={(e) =>
          setProduct({
            ...product,
            name: e.target.value,
          })
        }
        placeholder="Enter product name"
      />

      <FormField
        label="Brand"
        type="text"
        value={product.brand}
        onChange={(e) =>
          setProduct({
            ...product,
            brand: e.target.value,
          })
        }
        placeholder="Enter brand name"
      />

      <div>
        <label className="block mb-2 text-sm font-medium">Category</label>

        <select
          value={product.category}
          onChange={(e) =>
            setProduct({
              ...product,
              category: e.target.value,
            })
          }
          className="w-full
          rounded-md
          border
          border-gray-300
          px-3
          py-2.5
          outline-none
          focus:ring-2
          focus:ring-primary/30"
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>

        <textarea
          rows={5}
          value={product.description}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value,
            })
          }
          placeholder="Enter product description"
          className="w-full
          rounded-md
          border
          border-gray-300
          px-3
          py-2.5
          resize-none
          outline-none
          focus:ring-2
          focus:ring-primary/30"
        />
      </div>
    </div>
  );
};

export default BasicInformation;
