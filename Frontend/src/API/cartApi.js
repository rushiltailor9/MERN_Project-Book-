import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/cart",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addToCart = (data) => API.post("/add", data);

export const getCart = () => API.get("/");

export const deleteCart = (id) => API.delete(`/delete/${id}`);

export const deleteCartItem = deleteCart;

export const updateQuantity = (id, quantity) =>
  API.put(`/update/${id}`, { quantity });

export const clearCart = () => API.delete("/delete");

