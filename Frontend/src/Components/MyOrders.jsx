import { useEffect, useState } from "react";
import { getUserOrders } from "../API/orderApi";
import { handleError } from "../utils";
import { Link } from "react-router-dom";
import "../CSS/Checkout.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getUserOrders();
                if (response.success && response.orders) {
                    setOrders(response.orders);
                }
            } catch (error) {
                console.error("Error fetching my orders:", error);
                handleError(error.response?.data?.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return { background: "#d1fae5", color: "#065f46" };
            case "shipped":
                return { background: "#dbeafe", color: "#1e40af" };
            case "processing":
                return { background: "#fef3c7", color: "#92400e" };
            case "cancelled":
                return { background: "#fee2e2", color: "#991b1b" };
            default:
                return { background: "#fef3c7", color: "#92400e" }; // Pending
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <div style={{ textAlign: "center", padding: "50px", color: "#1e293b" }}>
                    <h2>Loading Orders...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <h1 style={{ marginBottom: "25px", color: "#0f172a" }}>My Orders</h1>

                {orders.length === 0 ? (
                    <div className="checkout-card" style={{ textAlign: "center", padding: "40px" }}>
                        <h2>No orders found</h2>
                        <p style={{ color: "#64748b", margin: "15px 0" }}>
                            You haven't placed any orders yet.
                        </p>
                        <Link to="/books" className="place-order-btn" style={{ display: "inline-block", width: "auto", padding: "10px 24px", textDecoration: "none" }}>
                            Explore Books
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div className="checkout-card" key={order._id} style={{ marginBottom: "25px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "15px" }}>
                                <div>
                                    <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Order ID: </span>
                                    <strong style={{ fontFamily: "monospace", fontSize: "1rem" }}>#{order._id}</strong>
                                </div>
                                <span style={{
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    ...getStatusStyle(order.orderStatus)
                                }}>
                                    {order.orderStatus || "Pending"}
                                </span>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
                                <div>
                                    <h4 style={{ margin: "0 0 10px", color: "#334155" }}>Items:</h4>
                                    {order.items?.map((item, idx) => {
                                        const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                                        return (
                                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                {item.bookImg && (
                                                    <img src={item.bookImg} alt={item.bookName} style={{ width: "40px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                                                )}
                                                <div>
                                                    <span style={{ fontWeight: "600", color: "#1e293b" }}>{item.bookName}</span>
                                                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                                        {hasDiscount ? (
                                                            <>
                                                                <span style={{ textDecoration: "line-through", marginRight: "4px" }}>₹{item.originalPrice}</span>
                                                                <strong style={{ color: "#2563eb" }}>₹{item.price}</strong>
                                                                {item.discountPercentage > 0 && (
                                                                    <span style={{ marginLeft: "6px", background: "#dcfce7", color: "#15803d", padding: "1px 5px", borderRadius: "3px", fontSize: "0.75rem", fontWeight: "600" }}>
                                                                        {item.discountPercentage}% OFF
                                                                    </span>
                                                                )}
                                                                <span> × {item.quantity}</span>
                                                            </>
                                                        ) : (
                                                            `₹${item.price} × ${item.quantity}`
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div>
                                    <h4 style={{ margin: "0 0 10px", color: "#334155" }}>Delivery Address:</h4>
                                    <p style={{ margin: "0", fontSize: "0.9rem", color: "#475569", lineHeight: "1.4" }}>
                                        <strong>{order.address?.name}</strong> ({order.address?.phone})<br />
                                        {order.address?.address}<br />
                                        {order.address?.city} - {order.address?.pincode}
                                    </p>
                                    <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#475569" }}>
                                        <strong>Payment:</strong> {order.paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}
                                    </p>
                                </div>
                            </div>

                            <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                        Placed on: {new Date(order.createdAt || order._id.substring(0,8)).toLocaleDateString()}
                                    </span>
                                    {order.totalDiscount && order.totalDiscount > 0 ? (
                                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                            Subtotal: <span style={{ textDecoration: "line-through" }}>₹{order.subtotal || (order.totalAmount + order.totalDiscount)}</span>{" "}
                                            | Discount: <strong style={{ color: "#16a34a" }}>-₹{order.totalDiscount}</strong>
                                        </div>
                                    ) : null}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                    <Link
                                        to={`/invoice/${order._id}`}
                                        style={{
                                            padding: "6px 14px",
                                            background: "#2563eb",
                                            color: "#ffffff",
                                            borderRadius: "6px",
                                            fontSize: "0.85rem",
                                            fontWeight: "600",
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px"
                                        }}
                                    >
                                        📄 View Invoice
                                    </Link>
                                    <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0f172a" }}>
                                        Total: ₹{order.totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
