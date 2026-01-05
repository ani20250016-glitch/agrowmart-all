// src/api/blogApi.js
// Author : Siddheshwar Swami 
// Date : 29 / 12 / 2025 

import axiosClient from "./apiClient";

const BLOGS_URL = "./apiClient.js";

export const getAllBlogs = async () => {
  const res = await axiosClient.get(BLOGS_URL);
  return res.data; // List<BlogResponseDto>
};

export const getPublishedBlogs = async () => {
  const res = await axiosClient.get(`${BLOGS_URL}/published`);
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await axiosClient.get(`${BLOGS_URL}/${id}`);
  return res.data;
};

export const createBlog = async (blog) => {
  const res = await axiosClient.post(BLOGS_URL, blog);
  return res.data;
};

export const updateBlog = async (id, blog) => {
  const res = await axiosClient.put(`${BLOGS_URL}/${id}`, blog);
  return res.data;
};

export const deleteBlog = async (id) => {
  await axiosClient.delete(`${BLOGS_URL}/${id}`);
};
