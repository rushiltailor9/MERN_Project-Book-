import axios from "axios";

const getToken = () =>{
    return localStorage.getItem("token");
}

export const getAllUsers = async() =>{
    const response = await axios.get(
        `http://localhost:5000/admin/users`,
        {
            headers:{
                Authorization: `Bearer ${getToken()}` 
            }
        }
    )

    return response.data;
}

export const toggelBlockUser = async(userId) =>{
    const response = await axios.patch(
        `http://localhost:5000/admin/users/${userId}/block`,
        {},
        {
            headers:{
                Authorization: `Bearer ${getToken()}` 
            }
        }
    )

    return response.data;
}

export const delelteUser = async(userId) =>{
    const response = await axios.delete(
        `http://localhost:5000/admin/users/${userId}`,
        {
            headers:{
                Authorization: `Bearer ${getToken()}` 
            }
        }
    )

    return response.data;
}