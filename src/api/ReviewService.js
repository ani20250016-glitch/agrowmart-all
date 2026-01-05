import apiClient from './apiClient';

const ReviewService = {

  // ================= SHOPS APIs =================

  // 1. Get All Shops (GET)
  getAllShops: async () => {
    // Backend: @GetMapping("/shops") inside /api/admin
    const response = await apiClient.get('/admin/shops'); 
    return response.data;
  },

  // 2. Add New Shop (POST) - 🔥 हे मिसिंग होते
  addShop: async (shopData) => {
    // Backend: @PostMapping("/shops/add")
    const response = await apiClient.post('/admin/shops/add', shopData);
    return response.data;
  },

  // 3. Bulk Delete Shops (DELETE)
  deleteBulkShops: async (ids) => {
    // Backend: @DeleteMapping("/shops/bulk-delete")
    // Axios मध्ये body पाठवण्यासाठी 'data' key लागते, हे तुम्ही बरोबर केले आहे 👍
    const response = await apiClient.delete('/admin/shops/bulk-delete', { data: ids });
    return response.data;
  },

  // ================= REVIEWS APIs (ADMIN SIDE) =================
  
  // 4. Get Reviews by Shop ID (GET)
  getReviewsByShop: async (shopId) => {
    // Backend: @GetMapping("/reviews/shop/{shopId}")
    const response = await apiClient.get(`/admin/reviews/shop/${shopId}`);
    return response.data;
  },

  // 5. Reply to Review (POST)
  replyToReview: async (id, message) => {
    // Backend: @PostMapping("/reviews/{id}/reply") expecting Map<String, String>
    const response = await apiClient.post(`/admin/reviews/${id}/reply`, { message });
    return response.data;
  },

  // 6. Toggle Hide/Unhide (PUT)
  toggleHideReview: async (id) => {
    // Backend: @PutMapping("/reviews/{id}/toggle-hide")
    const response = await apiClient.put(`/admin/reviews/${id}/toggle-hide`);
    return response.data;
  },

  // 7. Bulk Hide Reviews (PUT)
  bulkHideReviews: async (ids) => {
    // Backend: @PutMapping("/reviews/bulk-hide") expecting List<Long>
    const response = await apiClient.put('/admin/reviews/bulk-hide', ids);
    return response.data;
  },

  // 8. Delete Single Review (DELETE)
  deleteReview: async (id) => {
    // Backend: @DeleteMapping("/reviews/{id}")
    const response = await apiClient.delete(`/admin/reviews/${id}`);
    return response.data;
  },

  // 9. Bulk Delete Reviews (DELETE)
  bulkDeleteReviews: async (ids) => {
    // Backend: @DeleteMapping("/reviews/bulk-delete")
    const response = await apiClient.delete('/admin/reviews/bulk-delete', { data: ids });
    return response.data;
  }
};

export default ReviewService;