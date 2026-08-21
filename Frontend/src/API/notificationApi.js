import axios from "axios";

const API = axios.create({

    baseURL: "http://localhost:5000/notification"
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

export const getNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "admin-token") {
        return { success: true, notifications: [], unreadCount: 0 };
    }
    const response = await API.get("/");
    return response.data;
};

export const markNotificationRead = async(id) =>{
    const response = await API.put(`/${id}`, {});
    return response.data;
}

export const markAllNotificationsRead = async() =>{
    const response = await API.put("/read-all", {});
    return response.data;
}

// Backwards-compatible aliases for any existing imports.
export const getNotification = getNotifications;
export const markAllNotification = markAllNotificationsRead;

