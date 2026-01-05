import api from "./apiClient";

// Get all roles
export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

// Create new role
export const createRole = async (roleData) => {
  const response = await api.post("/roles", roleData);
  return response.data;
};

// Update role permissions by role name
export const updateRolePermissions = async (roleName, permissions) => {
  const response = await api.put(`/roles/${roleName}`, permissions);
  return response.data;
};
