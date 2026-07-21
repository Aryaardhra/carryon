import { IoTrashBinSharp } from "react-icons/io5";
import AdminButton from "../AdminButton";
import FormField from "../FormField";

const DynamicList = ({ title, placeholder, items, setItems, buttonText }) => {
  
  const addItem = () => {
    setItems([...items, ""]);
  };

  const updateItem = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems([...updated]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems([...updated]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>

        <AdminButton type="button" onClick={addItem}>
          {buttonText}
        </AdminButton>
      </div>

      {items.length === 0 && (
        <div className="text-center text-gray-500 border border-dashed rounded-lg p-6">
          No {title.toLowerCase()} added.
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <FormField
              value={item}
              placeholder={placeholder}
              onChange={(e) => updateItem(index, e.target.value)}
            />

            <button type="button" onClick={() => removeItem(index)}>
              <IoTrashBinSharp
                className="text-red-500 hover:text-red-700"
                size={20}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicList;
