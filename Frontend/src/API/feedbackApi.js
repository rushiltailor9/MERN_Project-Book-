import axios from "axios";

const API = axios.create({
    baseURL:"http://localhost:5000",
});

export const sendFeedback = (data) => API.post("/feedback",data);

export const getFeedback = async () => {
    const response = await axios.get("http://localhost:5000/feedback");
    return response.data;
};