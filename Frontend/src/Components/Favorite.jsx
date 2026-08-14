import {
    useEffect,
    useState
} from "react";

import {
    FaHeart
} from "react-icons/fa";

import {
    getFavorites,
    removeFavorite
} from "../API/favoriteApi";

import {
    handleSuccess,
    handleError
} from "../utils";


const Favorites = () => {

    const [favorites, setFavorites] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // FETCH FAVORITES
    // ==========================================

    useEffect(() => {

        const fetchFavorites = async () => {

            const token =
                localStorage.getItem("token");


            if (!token) {
                setFavorites([]);
                setLoading(false);
                return;
            }


            try {

                const response =
                    await getFavorites();


                setFavorites(
                    response.data.favorite || []
                );

            } catch (error) {

                console.error(
                    "Favorites Error:",
                    error.response?.data ||
                    error.message
                );

                if (
                    error.response?.status === 401
                ) {
                    handleError(
                        "Please login again."
                    );
                }

            } finally {

                setLoading(false);
            }
        };


        fetchFavorites();

    }, []);


    // ==========================================
    // REMOVE
    // ==========================================

    const handleRemove = async (bookId) => {

        try {

            await removeFavorite(bookId);


            setFavorites((prev) =>
                prev.filter(
                    (item) =>
                        item.bookId?._id !== bookId
                )
            );


            handleSuccess(
                "Removed from favorites"
            );

        } catch (error) {

            console.error(
                "Remove Favorite Error:",
                error.response?.data ||
                error.message
            );


            handleError(
                error.response?.data?.message ||
                "Failed to remove favorite"
            );
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="favorites-page">
                <h2>Loading Favorites...</h2>
            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="favorites-page">

            <h1>
                <FaHeart />
                {" "}
                My Favorites
            </h1>


            {favorites.length === 0 ? (

                <div className="no-favorites">

                    <h2>
                        No Favorite Books
                    </h2>

                    <p>
                        Add books to your
                        favorites to see them here.
                    </p>

                </div>

            ) : (

                <div className="books-grid">

                    {favorites.map((item) => {

                        const book =
                            item.bookId;


                        // Book was deleted
                        if (!book) {
                            return null;
                        }


                        return (
                            <div
                                className="book-card"
                                key={item._id}
                            >

                                <button
                                    type="button"
                                    className="favorite-btn favorite-active"
                                    onClick={() =>
                                        handleRemove(
                                            book._id
                                        )
                                    }
                                >
                                    <FaHeart />
                                </button>


                                <img
                                    src={book.bookImg}
                                    alt={book.bookName}
                                    className="book-image"
                                />


                                <div className="book-details">

                                    <h2>
                                        {book.bookName}
                                    </h2>


                                    <p>
                                        <strong>
                                            Author:
                                        </strong>{" "}
                                        {book.authorName}
                                    </p>


                                    <p>
                                        <strong>
                                            Language:
                                        </strong>{" "}
                                        {book.language}
                                    </p>


                                    <p>
                                        <strong>
                                            Price:
                                        </strong>{" "}
                                        ₹{book.price}
                                    </p>


                                    <div className="stock-status">

                                        {book.stock > 0 ? (

                                            <span className="in-stock">
                                                IN STOCK
                                            </span>

                                        ) : (

                                            <span className="out-stock">
                                                OUT OF STOCK
                                            </span>

                                        )}

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemove(
                                                book._id
                                            )
                                        }
                                    >
                                        Remove Favorite
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};


export default Favorites;