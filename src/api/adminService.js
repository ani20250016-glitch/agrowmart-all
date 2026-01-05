import api from "./apiClient";

// Get all admins
export const getAdmins = async () => {
  const response = await api.get("/admins");
  return response.data;
};

// Get single admin by ID
export const getAdminById = async (id) => {
  const response = await api.get(`/admins/${id}`);
  return response.data;
};

// Create new admin
export const createAdmin = async (adminData) => {
  const response = await api.post("/admins", adminData);
  return response.data;
};

// Update admin by ID
export const updateAdmin = async (id, adminData) => {
  const response = await api.put(`/admins/${id}`, adminData);
  return response.data;
};

// Delete admin by ID
export const deleteAdmin = async (id) => {
  const response = await api.delete(`/admins/${id}`);
  return response.data;
};


