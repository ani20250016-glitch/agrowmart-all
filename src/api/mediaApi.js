// src/api/mediaApi.js
// Author: Siddheshwar Swami 
// Date: 30/12/2025 
import axiosClient from './apiClient';

const API_BASE = '/api/v1/media';

export const getAllMedia = async () => {
  try {
    const response = await axiosClient.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error('getAllMedia error:', error);
    throw new Error('Failed to fetch media from server');
  }
};

export const createMedia = async (data) => {
  try {
    const response = await axiosClient.post(API_BASE, data);
    return response.data;
  } catch (error) {
    console.error('createMedia error:', error);
    throw error;
  }
};

export const updateMedia = async (id, data) => {
  try {
    const response = await axiosClient.put(`${API_BASE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('updateMedia error:', error);
    throw error;
  }
};

export const deleteMedia = async (id) => {
  try {
    await axiosClient.delete(`${API_BASE}/${id}`);
  } catch (error) {
    console.error('deleteMedia error:', error);
    throw error;
  }
};



// // Author: Siddheshwar Swami 
// // Date: 30/12/2025 
// import axiosClient from './axiosClient';

// export const getAllMedia = () => axiosClient.get('/api/v1/media');
// export const getActiveMedia = () => axiosClient.get('/api/v1/media/active');
// export const getMediaByType = (mediaType) => axiosClient.get(`/api/v1/media/type/${mediaType}`);
// export const getMediaById = (id) => axiosClient.get(`/api/v1/media/${id}`);
// export const createMedia = (data) => axiosClient.post('/api/v1/media', data);
// export const updateMedia = (id, data) => axiosClient.put(`/api/v1/media/${id}`, data);
// export const deleteMedia = (id) => axiosClient.delete(`/api/v1/media/${id}`);
