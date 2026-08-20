import axios from "axios";

const API = "http://localhost:5000/discount";

export const getAllDiscount = async() =>{
    const response = 
        await axios.get(
            API,
            {
                withCredentials: true
            }
        );
    return response;
}

export const addDiscount = async(discountData)=>{
    const response = 
        await axios.post(
            API,
            discountData,
            {
                withCredentials: true
            }
        );
        return response;
}

export const updateDiscount = async(id, discountData) =>{
    const response = await axios.put(
        `${API}/${id}}`,
        discountData,
        {
            withCredentials: true
        }
    );
    return response;
}

export const deleteDiscount = async (id) => {
        const response =
            await axios.delete(
                `${API}/${id}`,
                {
                    withCredentials: true
                }
            );
        return response.data;
}

export const getBookDiscount =async(bookId) =>{
    const response = await axios.get(
        `${API}/book/${bookId}`,
        {
            withCredentials: true
        }
    );
    return response;
}