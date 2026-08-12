import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/order",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  const response = await API.put(`/status/${id}`, { orderStatus });
  return response.data;
};