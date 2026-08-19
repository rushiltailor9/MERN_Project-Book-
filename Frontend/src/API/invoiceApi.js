import axios from "axios";

const API_URL =
    "http://localhost:5000";

const getToken = () => {
    return localStorage.getItem("token");
};
// =====================================
// CREATE INVOICE
// =====================================
export const createInvoice =
    async (data) => {
        const response =
            await axios.post(
                `${API_URL}/invoice/create`,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );
        return response.data;
    };
// =====================================
// GET INVOICE
// =====================================
export const getInvoice =
    async (orderId) => {
        const response =
            await axios.get(
                `${API_URL}/invoice/${orderId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );
        return response.data;
    };