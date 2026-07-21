import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import { IoTrashBinSharp } from "react-icons/io5";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
import {
  getAdminProducts,
  softDeleteProduct,
  toggleProductStatus,
} from "../../services/productService";
import AdminHeader from "./AdminHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminButton from "../../components/admin/AdminButton";

const ProductList = () => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminProducts();
      setProducts(data.products);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await toggleProductStatus(id);
      toast.success(data.message);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update product status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { data } = await softDeleteProduct(id);
      toast.success(data.message);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <AdminHeader
        title="Products"
        buttonText="+ Add Product"
        onButtonClick={() => navigate("/admin/add-product")}
      />

      <AdminCard>
        {loading ? (
          <div className="py-20 text-center">Loading Products...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No Products Found
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={product.featuredImage?.url || assets.upload_area}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg border object-cover"
                    />
                  </td>

                  <td>
                    <div>
                      <p className="font-medium">{product.name}</p>

                      <div className="flex gap-2 mt-1">
                        {product.featured && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}

                        {product.bestSeller && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Bestseller
                          </span>
                        )}

                        {product.latest && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>{product.category?.name}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.minPrice}</td>
                  <td>{product.totalStock}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>

                  <td>
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => navigate(`/admin/edit/${product._id}`)}
                      >
                        <FaPencil
                          size={18}
                          className="text-blue-900 hover:text-primary"
                        />
                      </button>

                      <button onClick={() => handleToggleStatus(product._id)}>
                        {product.isActive ? (
                          <PiToggleRightFill
                            size={28}
                            className="text-green-600"
                          />
                        ) : (
                          <PiToggleLeftFill
                            size={28}
                            className="text-gray-400"
                          />
                        )}
                      </button>

                      <button onClick={() => handleDelete(product._id)}>
                        <IoTrashBinSharp
                          size={20}
                          className="text-red-500 hover:text-red-700"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>
    </div>
  );
};

export default ProductList;
