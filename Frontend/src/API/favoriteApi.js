import axios from "axios";

const API_URL = "http://localhost:5000/favorite";

const getToken = () => {
    return localStorage.getItem("token");
};

const getConfig = () => {
    const token = getToken();

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};


// ADD FAVORITE
export const addFavorite = async (bookId) => {
    return await axios.post(
        `${API_URL}/add`,
        { bookId },
        getConfig()
    );
};


// GET FAVORITES
export const getFavorites = async () => {
    return await axios.get(
        API_URL,
        getConfig()
    );
};


// CHECK FAVORITE
export const checkFavorite = async (bookId) => {
    return await axios.get(
        `${API_URL}/check/${bookId}`,
        getConfig()
    );
};


// REMOVE FAVORITE
export const removeFavorite = async (bookId) => {
    return await axios.delete(
        `${API_URL}/${bookId}`,
        getConfig()
    );
};