import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/favorite",
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

// ADD FAVORITE — POST /favorite
export const addFavorite = async (bookId) => {
    return API.post("/", { bookId });
};

// GET FAVORITES — GET /favorite
export const getFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "admin-token") {
        return { data: { favorite: [] } };
    }
    return API.get("/");
};

// CHECK FAVORITE — GET /favorite/:bookId
export const checkFavorite = async (bookId) => {
    return API.get(`/${bookId}`);
};

// REMOVE FAVORITE — DELETE /favorite/:bookId
export const removeFavorite = async (bookId) => {
    return API.delete(`/${bookId}`);
};
