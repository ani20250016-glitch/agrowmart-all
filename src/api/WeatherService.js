// Author: Prajakta Darade
// File Purpose:
// - Frontend service file for Admin Weather Module
// - Handles all API calls related to weather settings, API keys, and live weather
// - Uses Axios instance (apiClient) for HTTP requests

import api from './apiClient';
// 👆 Importing pre-configured Axios instance
// 👉 This usually contains baseURL, interceptors, auth headers, etc.

const BASE_URL = '/v1/secure/admin/weather-module';
// 👆 Base API path for all admin weather module endpoints
// 👉 This should match backend controller mapping

// ======================================================
// 1️⃣ Fetch all providers and their API keys
// ======================================================
export const getAllApiKeys = async () => {
    // 👆 Calls backend API to fetch all weather providers + API keys
    // 👉 Used to display provider list in Admin UI

    const response = await api.get(
        `${BASE_URL}/credentials/list-all`
    );

    // 👆 Returns only response data to the component
    return response.data;
};

// ======================================================
// 2️⃣ Save / Update API key for a specific provider
// ======================================================
export const saveApiKey = async (providerId, apiKey) => {
    // 👆 Payload structure expected by backend
    // 👉 provider.id is used to link API key with provider

    const payload = {
        provider: { id: providerId },
        apiKey: apiKey,
        isActive: true
        // 👆 API key will be marked active by default
    };

    const response = await api.post(
        `${BASE_URL}/credentials/update-provider-keys`,
        payload
    );

    // 👆 Backend returns success message
    return response.data;
};

// ======================================================
// 3️⃣ Fetch global weather configuration settings
// ======================================================
export const getWeatherSettings = async () => {
    // 👆 Fetches global weather settings
    // 👉 Example: default location, unit, refresh rate

    const response = await api.get(
        `${BASE_URL}/configuration/fetch-global-parameters`
    );

    return response.data;
};

// ======================================================
// 4️⃣ Save global weather configuration settings
// ======================================================
export const saveWeatherSettings = async (settings) => {
    // 👆 Sends updated weather settings to backend
    // 👉 settings object contains location, unit, refresh rate, etc.

    const response = await api.post(
        `${BASE_URL}/configuration/update-global-parameters`,
        settings
    );

    return response.data;
};

// ======================================================
// 5️⃣ Fetch live / realtime weather data
// ======================================================
export const getLiveWeather = async () => {
    // 👆 Calls backend to fetch real-time weather data
    // 👉 Backend internally calls external weather API

    const response = await api.get(
        `${BASE_URL}/monitoring/realtime-forecast-check`
    );

    return response.data;
};
