import axiosInstance from "./axiosInstance";

export const updateProfile = async (formData) => {
  const { data } = await axiosInstance.put(
    "/v1/user/update-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const changePassword = async (body) => {
  const { data } = await axiosInstance.patch(
    "/v1/user/change-password",
    body
  );

  return data;
};

export const deleteAccount = async (password) => {
  const { data } = await axiosInstance.delete(
    "/v1/user/delete-account",
    {
      data: { password },
    }
  );

  return data;
};