import axios from "axios";

const API = axios.create({

    baseURL: "http://localhost:5000/notification"
});

API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getNotifications = async() =>{
    const response = await API.get("/");
    return response.data;
}

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

