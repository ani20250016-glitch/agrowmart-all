// src/api/bannerApi.js

// Author : Siddheshwar Swami 
// Date : 24 to 26 / 12/ 2025 
import { SwitchCameraIcon } from "lucide-react";
import axiosClient from "./apiClient";

const BANNERS_URL = "/api/banners";

export const getAllBanners = async () => {
  const res = await axiosClient.get(BANNERS_URL);
  return res.data; // List<BannerResponseDto>
};

export const getBannerById = async (id) => {
  const res = await axiosClient.get(`${BANNERS_URL}/${id}`);
  return res.data;
};

export const createBanner = async (banner) => {
  const res = await axiosClient.post(BANNERS_URL, banner);
  return res.data;
};

export const updateBanner = async (id, banner) => {
  const res = await axiosClient.put(`${BANNERS_URL}/${id}`, banner);
  return res.data;
};

export const deleteBanner = async (id) => {
  await axiosClient.delete(`${BANNERS_URL}/${id}`);
};
