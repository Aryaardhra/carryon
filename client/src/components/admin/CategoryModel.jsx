import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminInput from "./AdminInput";
import ImageUpload from "./ImageUpload";
import AdminButton from "./AdminButton";
import FormField from "./FormField";
import { addCategory, updateCategory } from "../../services/categoryService";

const CategoryModal = ({
  open,
  onClose,
  selectedCategory,
  refreshCategories,
}) => {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name);
      setFiles([]);
    } else {
      setName("");
      setFiles([]);
    }
  }, [selectedCategory, open]);

  if (!open) return null;

  const handleClose = () => {
    setName("");
    setFiles([]);
    onClose();
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);

      if (files[0]) {
        formData.append("image", files[0]);
      }

      let data;

      if (selectedCategory) {
        ({ data } = await updateCategory(selectedCategory._id, formData));
      } else {
        ({ data } = await addCategory(formData));
      }
      toast.success(data.message);
      await refreshCategories();

      setTimeout(() => {
        handleClose();
      }, 300);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-secondary mb-6">
          {selectedCategory ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <ImageUpload
            files={files}
            setFiles={setFiles}
            maxImages={1}
            initialImage={selectedCategory?.image?.url}
          />

          <FormField
            label="Category Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="border border-gray-300 rounded-md px-6 py-2 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <AdminButton loading={loading}>
              {selectedCategory ? "Update Category" : "Create Category"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
