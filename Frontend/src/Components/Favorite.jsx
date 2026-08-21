import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { getFavorites, removeFavorite } from "../API/favoriteApi";
import { addToCart } from "../API/cartApi";
import { getAllDiscount } from "../API/discountApi";
import { handleSuccess, handleError } from "../utils";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH FAVORITES & DISCOUNTS
    // ==========================================
    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");
            if (!token || token === "admin-token") {
                setFavorites([]);
                setLoading(false);
                return;
            }

            try {
                const response = await getFavorites();
                setFavorites(response.data?.favorite || []);
            } catch (error) {
                console.error("Favorites Error:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                    handleError("Please login again.");
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchDiscounts = async () => {
            try {
                const response = await getAllDiscount();
                if (response?.success) {
                    setDiscounts(response.discounts || []);
                }
            } catch (error) {
                console.error("Error fetching discounts for favorites:", error);
            }
        };

        fetchFavorites();
        fetchDiscounts();
    }, []);

    const getBookPricing = (book) => {
        const originalPrice = Number(book.price || 0);
        const now = new Date();

        const isCurrentlyActive = (d) =>
            d.isActive &&
            new Date(d.startDate) <= now &&
            new Date(d.endDate) >= now;

        const specificDiscount = discounts.find((d) => {
            const discountBookId =
                d.bookId && typeof d.bookId === "object" ? d.bookId._id : d.bookId;
            return isCurrentlyActive(d) && discountBookId === book._id;
        });

        const globalDiscount = discounts.find(
            (d) => isCurrentlyActive(d) && !d.bookId
        );

        const discount = specificDiscount || globalDiscount;

        if (!discount) {
            return {
                originalPrice,
                finalPrice: originalPrice,
                discountPercentage: 0,
                hasDiscount: false
            };
        }

        const discountPercentage = Number(discount.discountPercentage);
        const finalPrice = Number(
            (originalPrice - (originalPrice * discountPercentage) / 100).toFixed(2)
        );

        return {
            originalPrice,
            finalPrice,
            discountPercentage,
            hasDiscount: discountPercentage > 0
        };
    };

    // ==========================================
    // REMOVE
    // ==========================================
    const handleRemove = async (bookId) => {
        try {
            await removeFavorite(bookId);
            setFavorites((prev) =>
                prev.filter((item) => item.bookId?._id !== bookId)
            );
            handleSuccess("Removed from favorites");
        } catch (error) {
            console.error("Remove Favorite Error:", error.response?.data || error.message);
            handleError(error.response?.data?.message || "Failed to remove favorite");
        }
    };

    const handleAddToCart = async (book) => {
        if (!book) return;

        if (book.stock <= 0) {
            handleError("This Book Is Out of Stock");
            return;
        }

        const { finalPrice } = getBookPricing(book);

        try {
            const response = await addToCart({
                bookId: book._id,
                bookName: book.bookName,
                authorName: book.authorName,
                price: book.price,
                bookImg: book.bookImg,
                language: book.language,
                quantity: 1,
            });

            handleSuccess(response.data?.message || "Book added to cart!");
        } catch (error) {
            console.error("Add To Cart Error:", error.response?.data || error.message);
            const message =
                error.response?.status === 401
                    ? "Please login to add books to your cart."
                    : error.response?.data?.message || "Failed to add book to cart.";
            handleError(message);
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
            <h1 style={{ color: "#64748B", paddingLeft: "30px" }}>
                My Favorites Books ❤
            </h1>
            &nbsp;
            {favorites.length === 0 ? (
                <div className="no-favorites">
                    <h3 style={{ paddingLeft: "30px" }}>No Favorite Books</h3>
                </div>
            ) : (
                <div
                    className="books-grid"
                    style={{
                        display: "flex",
                        padding: "0px 0px 0px 40px",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        gap: "20px",
                        overflowX: "auto",
                        paddingBottom: "12px"
                    }}
                >
                    {favorites.map((item) => {
                        const book = item.bookId;
                        if (!book) return null;

                        const { originalPrice, finalPrice, discountPercentage, hasDiscount } = getBookPricing(book);

                        return (
                            <div
                                className="book-card"
                                key={item._id}
                                style={{
                                    minWidth: "280px",
                                    width: "280px",
                                    flex: "0 0 280px"
                                }}
                            >
                                <button
                                    type="button"
                                    className="favorite-btn favorite-active"
                                    onClick={() => handleRemove(book._id)}
                                >
                                    <FaHeart />
                                </button>
                                <img
                                    src={book.bookImg}
                                    alt={book.bookName}
                                    className="book-image"
                                />
                                <div className="book-details">
                                    <h2>{book.bookName}</h2>
                                    <p>
                                        <strong>Author:</strong> {book.authorName}
                                    </p>
                                    <p>
                                        <strong>Language:</strong> {book.language}
                                    </p>
                                    <p className="price" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", margin: "7px 0" }}>
                                        <strong>Price:</strong>{" "}
                                        {hasDiscount ? (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "0.85rem" }}>
                                                    ₹{originalPrice}
                                                </span>
                                                <span style={{ color: "#2563eb", fontWeight: "800", fontSize: "1rem" }}>
                                                    ₹{finalPrice}
                                                </span>
                                                <span style={{ background: "#e63946", color: "#fff", fontSize: "0.65rem", fontWeight: "700", padding: "2px 6px", borderRadius: "5px" }}>
                                                    {discountPercentage}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ color: "#2563eb", fontWeight: "800", fontSize: "1rem" }}>
                                                ₹{originalPrice}
                                            </span>
                                        )}
                                    </p>
                                    <div className="stock-status">
                                        {book.stock > 0 ? (
                                            <span className="in-stock">IN STOCK</span>
                                        ) : (
                                            <span className="out-stock">OUT OF STOCK</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        style={{
                                            display: "inline-block",
                                            padding: "12px 24px",
                                            background: book.stock > 0 ? "#2d7ff9" : "#94a3b8",
                                            height: "50px",
                                            width: "100%",
                                            color: "white",
                                            fontWeight: "600",
                                            borderRadius: "8px",
                                            textDecoration: "none",
                                            border: "none",
                                            cursor: book.stock > 0 ? "pointer" : "not-allowed",
                                        }}
                                        disabled={book.stock <= 0}
                                        onClick={() => handleAddToCart(book)}
                                    >
                                        {book.stock > 0 ? "Add To Cart" : "Out Of Stock"}
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