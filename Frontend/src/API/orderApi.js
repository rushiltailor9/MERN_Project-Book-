import axios from "axios";

export const placeOrder = async (orderData) => {
    const response = await axios.post(
        "http://localhost:5000/order",
        orderData
    );

    return response.data;
};