import { useState } from "react";
import toast from "react-hot-toast";
import AdminCard from "../../components/admin/AdminCard";
import SectionTitle from "../../components/admin/SectionTitle";
import ImageUpload from "../../components/admin/ImageUpload";
import AdminInput from "../../components/admin/AdminInput";
import AdminButton from "../../components/admin/AdminButton";

const AddCategory = () => {
    
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (files[0]) {
        formData.append("image", files[0]);
      }
      const { data } = await addCategory(formData);
      toast.success(data.message);
      setName("");
      setFiles([]);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "Unable to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-10">
      <AdminCard className="max-w-2xl">
        <SectionTitle>Add Category</SectionTitle>

        <form onSubmit={submitHandler} className="space-y-6">
          <ImageUpload files={files} setFiles={setFiles} maxImages={1} />

          <AdminInput
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />

          <AdminButton loading={loading}>Add Category</AdminButton>
        </form>
      </AdminCard>
    </div>
  );
};

export default AddCategory;
