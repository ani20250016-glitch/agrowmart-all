import apiClient from "./apiClient";

export const getCustomerById = async (id) => {
  const res = await apiClient.get(`/admin/customers/${id}`);
  return res.data; // { success, data }
};

export const getCustomerFavorites = async () => {
  return []; // optional
};
