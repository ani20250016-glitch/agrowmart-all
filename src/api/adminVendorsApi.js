import apiClient from "./apiClient";

const BASE_URL = "/admin/vendors"; 
// कारण baseURL आधीच http://localhost:8094/api आहे

export const getVendors = (params) => {
  return apiClient.get(BASE_URL, { params });
};

export const getVendorProfile = (id) => {
  return apiClient.get(`${BASE_URL}/${id}`);
};

export const blockVendor = (id) => {
  return apiClient.put(`${BASE_URL}/${id}/block`);
};

export const unblockVendor = (id) => {
  return apiClient.put(`${BASE_URL}/${id}/unblock`);
};

export const getVendorProducts = (vendorId, page = 0, size = 20) => {
  return apiClient.get(`${BASE_URL}/${vendorId}/products`, {
    params: { page, size },
  });
};
