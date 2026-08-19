import axios from "axios";

const API_URL = "http://localhost:5000";

const getToken = () => {
    return localStorage.getItem("token");
};

// =====================================
// CREATE DUMMY PAYMENT
// =====================================
export const createDummyPayment = async (paymentData) => {
    const response = await axios.post(
        `${API_URL}/payment/dummy`,
        paymentData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );
    return response.data;
};
