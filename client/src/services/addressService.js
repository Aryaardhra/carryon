import axiosInstance from "../api/axiosInstance";

export const getAddresses = async () => {
  return await axiosInstance.get("v1/addresses");
};

export const addAddress = async (addressData) => {
  return await axiosInstance.post("v1/addresses", addressData);
};

export const updateAddress = async (addressId, addressData) => {
  return await axiosInstance.put(
    `v1/addresses/${addressId}`,
    addressData,
  );
};

export const deleteAddress = async (addressId) => {
  return await axiosInstance.delete(
    `v1/addresses/${addressId}`,
  );
};