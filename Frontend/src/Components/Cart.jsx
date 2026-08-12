import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, updateQuantity, deleteCartItem, clearCart } from "../API/cartApi";
import { handleSuccess, handleError } from "../utils";
import "../CSS/Cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                setLoading(true);
                const response = await getCart();
                if (response.data && response.data.cart) {
                    setCartItems(response.data.cart);
                    localStorage.setItem("cart", JSON.stringify(response.data.cart));
                } else if (response.data && Array.isArray(response.data)) {
                    setCartItems(response.data);
                    localStorage.setItem("cart", JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
                handleError(error.response?.data?.message || "Failed to load cart");
            } finally {
                setLoading(false);
            }
        };
        fetchCartData();
    }, []);

    const handleQuantityChange = async (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) {
            handleRemoveItem(id);
            return;
        }

        try {
            const response = await updateQuantity(id, newQty);
            if (response.data && response.data.success) {
                setCartItems((prev) =>
                    prev.map((item) => (item._id === id ? { ...item, quantity: newQty } : item))
                );
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            handleError(error.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            const response = await deleteCartItem(id);
            if (response.data && response.data.success) {
                handleSuccess("Item removed from cart");
                const updated = cartItems.filter((item) => item._id !== id);
                setCartItems(updated);
                localStorage.setItem("cart", JSON.stringify(updated));
            }
        } catch (error) {
            console.error("Error deleting cart item:", error);
            handleError(error.response?.data?.message || "Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) return;
        try {
            const response = await clearCart();
            if (response.data && response.data.success) {
                handleSuccess("Cart cleared successfully");
                setCartItems([]);
                localStorage.removeItem("cart");
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
            handleError(error.response?.data?.message || "Failed to clear cart");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            const price = item.price || item.bookId?.price || 0;
            return acc + price * item.quantity;
        }, 0);
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            handleError("Your cart is empty!");
            return;
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div style={{ textAlign: "center", padding: "50px", color: "#f8fafc" }}>
                    <h2>Loading Cart...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1 className="cart-title">Shopping Cart</h1>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <span className="cart-total">Total: ₹{calculateTotal()}</span>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="remove-btn"
                            style={{ background: "#ef4444" }}
                        >
                            Clear Cart
                        </button>
                    )}
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <h2>Your cart is empty</h2>
                    <p style={{ marginTop: "10px", marginBottom: "20px" }}>
                        Looks like you haven't added any books to your cart yet.
                    </p>
                    <Link to="/books" className="place-order-btn" style={{ display: "inline-block", width: "auto", padding: "12px 24px", textDecoration: "none" }}>
                        Browse Books
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-list">
                        {cartItems.map((item) => {
                            const title = item.bookName || item.bookId?.bookName || "Book";
                            const author = item.authorName || item.bookId?.authorName || "";
                            const price = item.price || item.bookId?.price || 0;
                            const image = item.bookImg || item.bookId?.bookImg ;

                            return (
                                <div className="cart-item" key={item._id}>
                                    <img src={image} alt={title} className="cart-item-image" />

                                    <div className="cart-item-details">
                                        <h3>{title}</h3>
                                        {author && <p><strong>Author:</strong> {author}</p>}
                                        <p><strong>Price:</strong> ₹{price}</p>
                                        <p><strong>Subtotal:</strong> ₹{price * item.quantity}</p>

                                        <div className="cart-actions">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemoveItem(item._id)}
                                                style={{ marginLeft: "15px" }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-footer" style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", padding: "20px", borderRadius: "12px" }}>
                        <div>
                            <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "#cbd5e1" }}>
                                Total Amount:
                            </span>
                            <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#38bdf8", marginLeft: "10px" }}>
                                ₹{calculateTotal()}
                            </span>
                        </div>
                        <button
                            onClick={handleProceedToCheckout}
                            className="place-order-btn"
                            style={{ width: "auto", padding: "14px 32px", fontSize: "1rem" }}
                        >
                            Proceed to Checkout →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;