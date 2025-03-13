import _axios from "axios";

export const axios = _axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type RefreshTokenSubscriberCallback = (newToken: string) => void;

let isRefreshing = false;
let refreshSubscribers: RefreshTokenSubscriberCallback[] = [];

const addSubscriber = (callback: RefreshTokenSubscriberCallback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      localStorage.getItem("deviceId") &&
      error.response.status === 401 &&
      error.response.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axios(originalRequest));
          });
        });
      }

      isRefreshing = true;
      localStorage.removeItem("token");

      try {
        const { data: refreshTokenResponse } = await axios.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              "x-device-id": localStorage.getItem("deviceId"),
            },
          },
        );

        const { token } = refreshTokenResponse;

        localStorage.setItem("token", token);

        return axios(originalRequest);
      } catch (error) {
        window.location.href = "/login";
        console.error(error);
      } finally {
        isRefreshing = false;
        onRefreshed("refresh-token error");
      }
    }

    throw error;
  },
);
