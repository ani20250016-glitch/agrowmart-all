import apiClient from "./apiClient";

export const getCustomerById = async (id) => {
  const response = await apiClient.get(`/admin/customers/${id}`);
  return response.data;
};

export const getCustomerFavorites = async (id) => {
  const response = await apiClient.get(`/customers/${id}/favorites`);
  return response.data;
};

export const getAllCustomers = async (page = 0, size = 10, search = "") => {
  const params = { page, size };
  if (search) params.search = search;

  const response = await apiClient.get("/admin/customers/all", { params });
  return response.data;
};

export const blockCustomer = async (id) => {
  const response = await apiClient.put(`/admin/customers/${id}/block`);
  return response.data;
};

export const unblockCustomer = async (id) => {
  const response = await apiClient.put(`/admin/customers/${id}/unblock`);
  return response.data;
};
