import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000"
});


export const getUsers = async() =>{
    const response = await API.get("/auth");
    return response.data;
}