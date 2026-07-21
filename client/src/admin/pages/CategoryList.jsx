import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminCard from "../../components/admin/AdminCard";
import { assets } from "../../assets/data/assets";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import CategoryModal from "../../components/admin/CategoryModel";
import {
  deleteCategory,
  getCategories,
  toggleCategoryStatus,
} from "../../services/categoryService";
import Button from "../../components/form/Button";
import { PiToggleRightFill } from "react-icons/pi";
import { PiToggleLeftFill } from "react-icons/pi";

const CategoryList = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await toggleCategoryStatus(id);
      toast.success(data.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update category status.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <AdminHeader
        title="Categories"
        buttonText="+ Add Category"
        onButtonClick={() => {
          setSelectedCategory(null);
          setShowModal(true);
        }}
      />

      <AdminCard>
        {loading ? (
          <div className="py-20 text-center">Loading Categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No Categories Found
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">Image</th>
                <th className="text-left">Name</th>
                <th className="text-left">Slug</th>
                <th className="text-left">Status</th>
                <th className="text-left">Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={category.image?.url || assets.upload_area}
                      alt={category.name}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowModal(true);
                        }}
                      >
                        <FaPencil
                          size={18}
                          className="text-blue-950 hover:text-primary"
                        />
                      </button>

                      <button onClick={() => handleToggleStatus(category._id)}>
                        {category.isActive ? (
                          <PiToggleRightFill
                            size={28}
                            className="text-green-600 hover:text-green-700 transition"
                          />
                        ) : (
                          <PiToggleLeftFill
                            size={28}
                            className="text-gray-400 hover:text-gray-600 transition"
                          />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>
      <CategoryModal
        open={showModal}
        selectedCategory={selectedCategory}
        refreshCategories={fetchCategories}
        onClose={() => {
          setShowModal(false);
          setTimeout(() => {
            setSelectedCategory(null);
          }, 200);
        }}
      />
    </div>
  );
};
export default CategoryList;
