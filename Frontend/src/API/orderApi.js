import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/order",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "admin-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event("auth-logout"));
    }
    return Promise.reject(error);
  }
);

export const placeOrder = async (orderData) => {
  const response = await API.post("/", orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await API.get("/my-orders");
  return response.data;
};

export const getAllOrders = async () => {
  const response = await API.get("/all");
  return response.data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const response = await API.put(`/status/${id}`, { status: orderStatus });
  return response.data;
};
