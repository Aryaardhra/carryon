import axiosInstance from "../api/axiosInstance";

export const addProduct = (formData) => {
  return axiosInstance.post("/v1/product/add", formData);
};

export const getAdminProducts = (params = {}) => {
  return axiosInstance.get("/v1/product/admin/all", {
    params,
  });
};

export const getProducts = (params = {}) => {
  return axiosInstance.get("/v1/product/", {
    params,
  });
};

export const getProductById = (id) => {
  return axiosInstance.get(`/v1/product/pid/${id}`);
};

export const getProductBySlug = (slug) => {
  return axiosInstance.get(`/v1/product/${slug}`);
};

export const updateBasicInformation = (id, data) => {
  return axiosInstance.patch(`/v1/product/${id}/basic`, data);
};

export const updateProductPricing = (id, data) => {
  return axiosInstance.patch(`/v1/product/${id}/pricing`, data);
};

export const updateProductInventory = (id, data) => {
  return axiosInstance.patch(`/v1/product/${id}/inventory`, data);
};

export const updateFeaturedImage = (id, formData) => {
  return axiosInstance.patch(`/v1/product/${id}/featured-image`, formData);
};

export const updateGalleryImages = (id, formData) => {
  return axiosInstance.patch(`/v1/product/${id}/gallery-images`, formData);
};
export const updateVariantBasic = (id, data) =>{
  return axiosInstance.patch(`v1/product/${id}/variant-basic`, data);
};
export const updateVariantImages = (id, formData) => {
  return axiosInstance.patch(`/v1/product/${id}/variant-images`, formData);
};

// ---------------- Status ----------------

export const toggleProductStatus = (id) => {
  return axiosInstance.patch(`/v1/product/toggle-status/${id}`);
};

export const deleteProduct = (id) => {
  return axiosInstance.delete(`/v1/product/${id}`);
};

export const softDeleteProduct = (id) => {
  return axiosInstance.delete(`/v1/product/${id}`);
};

export const restoreProduct = (id) => {
  return axiosInstance.patch(`/v1/product/restore/${id}`);
};
export const permanentlyDeleteProduct = (id) => {
  return axiosInstance.delete(`/v1/product/permanent/${id}/`);
};
export const getDeletedProducts = () => {
  return axiosInstance.get("/v1/product/deleted");
};
