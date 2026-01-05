//Deepti Kadam
import api from "./apiClient";

// ================= GET ALL ACTIVE PRODUCTS =================
export const getAllProducts = () => {
  return api.get("/api/admin/products");
};

// ================= SEARCH PRODUCTS =================
export const searchProducts = (payload) => {
  return api.post("/api/admin/products/search", payload);
};

// ================= GET PRODUCT BY ID (VIEW DETAILS) =================
export const getProductById = (id) => {
  return api.get(`/api/admin/products/${id}`);
};

// ================= DELETE PRODUCT (SOFT DELETE) =================
export const deleteProduct = (id) => {
  return api.delete(`/api/admin/products/${id}`);
};

// ================= GET DELETED PRODUCTS =================
export const getDeletedProducts = () => {
  return api.get("/api/admin/products/deleted");
};

// ================= RESTORE PRODUCT =================
export const restoreProduct = (id) => {
  return api.put(`/api/admin/products/${id}/restore`);
};
// ================Categories===========================
export const getCategories = () => {
  return api.get("/api/admin/products/categories");
};
// ================= BLOCK PRODUCT =================
export const blockProduct = (id) => {
  return api.put(`/api/admin/products/${id}/block`);
};

// ================= UNBLOCK PRODUCT =================
export const unblockProduct = (id) => {
  return api.put(`/api/admin/products/${id}/unblock`);
};
//===============All Rating===========================
export const getAllRatings = () =>{
  return api.get("/api/admin/products/ratings");
};
//============Get Rating By Id
export const getRatingById = (ratingId) => {
  return api.get(`/api/admin/products/ratings/${ratingId}`);
};
export default {
  getAllProducts,
  searchProducts,
  getProductById,
  deleteProduct,
  getDeletedProducts,
  restoreProduct,
  getCategories,
  blockProduct,
  unblockProduct,
  getAllRatings,
  getRatingById
};
