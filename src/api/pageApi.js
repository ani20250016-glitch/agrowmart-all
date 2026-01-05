// src/api/pageApi.js
// Author: Siddheshwar Swami 
// Date: 02/01/2026

// import axiosClient from "./axiosClient";

// const PAGES_URL = "/api/pages";

// export const getAllPages = async () => {
//   const res = await axiosClient.get(PAGES_URL);
//   return res.data; // List<PageResponseDto>
// };

// export const getPageById = async (id) => {
//   const res = await axiosClient.get(`${PAGES_URL}/${id}`);
//   return res.data;
// };

// export const createPage = async (page) => {
//   const res = await axiosClient.post(PAGES_URL, page);
//   return res.data;
// };

// export const updatePage = async (id, page) => {
//   const res = await axiosClient.put(`${PAGES_URL}/${id}`, page);
//   return res.data;
// };

// export const deletePage = async (id) => {
//   await axiosClient.delete(`${PAGES_URL}/${id}`);
// };


// src/api/pageApi.js
// Author: Siddheshwar Swami 
// Date: 02/01/2026 

import axiosClient from './apiClient';

const API_BASE = '/api/pages';

export const getAllPages = async () => {
  try {
    const response = await axiosClient.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error('getAllPages error:', error);
    throw new Error('Failed to fetch pages from server');
  }
};

export const getPageById = async (id) => {
  try {
    const response = await axiosClient.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('getPageById error:', error);
    throw error;
  }
};

export const createPage = async (data) => {
  try {
    const response = await axiosClient.post(API_BASE, data);
    return response.data;
  } catch (error) {
    console.error('createPage error:', error);
    throw error;
  }
};

export const updatePage = async (id, data) => {
  try {
    const response = await axiosClient.put(`${API_BASE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('updatePage error:', error);
    throw error;
  }
};

export const deletePage = async (id) => {
  try {
    await axiosClient.delete(`${API_BASE}/${id}`);
  } catch (error) {
    console.error('deletePage error:', error);
    throw error;
  }
};

