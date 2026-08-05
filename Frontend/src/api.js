import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000"
});


export const getBooks = async() =>{
    const response = await API.get("/book");
    return response.data;
}

export const addBook = async(book) =>{
    const response = await API.post("/book",book);
    return response.data;
}

export const updateBook = async(id, book) =>{
    const response = await API.put(`/book/${id}`,book);
    return response.data;
}

export const deleteBook = async(id) =>{
    const response = await API.delete(`/book/${id}`);
    return response.data;
}