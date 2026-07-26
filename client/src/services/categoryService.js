import axiosInstance from "../api/axiosInstance";

export const addCategory = (formData) => {
  return axiosInstance.post("/v1/category/add", formData);
};

export const getCategories = () => {
  return axiosInstance.get("/v1/category/");
};

export const getCategoryById = (id) => {
  return axiosInstance.get(`/v1/category/${id}`);
};

export const updateCategory = (id, formData) => {
  return axiosInstance.put(`/v1/category/${id}`, formData);
};

export const deleteCategory = (id) => {
  return axiosInstance.delete(`/v1/category/${id}`);
};

export const toggleCategoryStatus = (id) => {
  return axiosInstance.patch(`/v1/category/toggle-status/${id}`);
};
