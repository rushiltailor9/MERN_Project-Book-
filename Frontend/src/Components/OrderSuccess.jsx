import { useLocation, Link } from "react-router-dom";
import "../CSS/Checkout.css";

const OrderSuccess = () => {
    const location = useLocation();
    const order = location.state?.order;

    return (
        <div className="checkout-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{
                maxWidth: "600px",
                width: "100%",
                background: "#ffffff",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                textAlign: "center",
                color: "#1e293b"
            }}>
                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#10b981",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    margin: "0 auto 20px"
                }}>
                    ✓
                </div>

                <h1 style={{ color: "#0f172a", marginBottom: "10px", fontSize: "2rem" }}>Order Placed Successfully!</h1>
                <p style={{ color: "#64748b", marginBottom: "30px" }}>
                    Thank you for your order. We are processing it and will deliver it soon.
                </p>

                {order && (
                    <div style={{
                        background: "#f8fafc",
                        padding: "20px",
                        borderRadius: "12px",
                        textAlign: "left",
                        marginBottom: "30px",
                        border: "1px solid #e2e8f0"
                    }}>
                        <p style={{ margin: "6px 0", color: "#334155" }}>
                            <strong>Order ID:</strong> <span style={{ fontFamily: "monospace" }}>#{order._id}</span>
                        </p>
                        <p style={{ margin: "6px 0", color: "#334155" }}>
                            <strong>Total Amount:</strong> ₹{order.totalAmount}
                        </p>
                        <p style={{ margin: "6px 0", color: "#334155" }}>
                            <strong>Payment Method:</strong> {order.paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}
                        </p>
                        <p style={{ margin: "6px 0", color: "#334155" }}>
                            <strong>Delivery Address:</strong> {order.address?.name}, {order.address?.address}, {order.address?.city} - {order.address?.pincode}
                        </p>
                        <p style={{ margin: "6px 0", color: "#334155" }}>
                            <strong>Status:</strong> <span style={{ color: "#d97706", fontWeight: "600" }}>{order.orderStatus || "Pending"}</span>
                        </p>
                    </div>
                )}

                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                    <Link
                        to="/my-orders"
                        className="place-order-btn"
                        style={{ display: "inline-block", width: "auto", padding: "12px 24px", textDecoration: "none" }}
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/books"
                        style={{
                            display: "inline-block",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#334155",
                            textDecoration: "none",
                            fontWeight: "600"
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
