import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaFileInvoice, FaListAlt, FaShoppingBag } from "react-icons/fa";
import "../CSS/Checkout.css";

function OrderComplete() {
    const location = useLocation();
    const navigate = useNavigate();

    const { order, payment} = location.state || {};

    if (!order) {
        return (
            <div className="checkout-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{
                    maxWidth: "500px",
                    width: "100%",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    textAlign: "center"
                }}>
                    <h2>Order information not found</h2>
                    <p style={{ color: "#64748b", margin: "15px 0" }}>It seems you haven't placed an order recently.</p>
                    <Link to="/books" className="place-order-btn" style={{ display: "inline-block", width: "auto", padding: "12px 24px", textDecoration: "none" }}>
                        Browse Books
                    </Link>
                </div>
            </div>
        );
    }

    const paymentMethodDisplay = payment?.paymentMethod || order.paymentMethod || "COD";
    const paymentStatusDisplay = payment?.paymentStatus || order.paymentStatus || (paymentMethodDisplay === "COD" ? "Pending" : "Paid");
    const transactionIdDisplay = payment?.transactionId || order.transactionId || "N/A";
    // const invoiceNum = invoice?.invoiceNumber || ("INV-" + (order._id ? order._id.substring(0, 8) : Date.now));

    return (
        <div className="checkout-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
            <div style={{
                maxWidth: "650px",
                width: "100%",
                background: "#ffffff",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                color: "#1e293b"
            }}>
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
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
                        margin: "0 auto 15px"
                    }}>
                        ✓
                    </div>
                    <h1 style={{ color: "#0f172a", fontSize: "2rem", margin: "0 0 8px 0" }}>🎉 Order Placed Successfully!</h1>
                    <p style={{ color: "#64748b", margin: 0 }}>Thank you for your purchase with READ-EASY. We're processing your books!</p>
                </div>

                {/* Details box */}
                <div style={{
                    background: "#f8fafc",
                    padding: "24px",
                    borderRadius: "12px",
                    marginBottom: "25px",
                    border: "1px solid #e2e8f0"
                }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "#0f172a", fontSize: "1.1rem" }}>Order Summary</h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        fontSize: "0.92rem"
                    }}>
                        <div>
                            <span style={{ color: "#64748b" }}>Order ID:</span>
                            <div style={{ fontWeight: "700", fontFamily: "monospace" }}>#{order._id}</div>
                        </div>
                        {/* Subtotal */}
                        {order.subtotal !== undefined && (
                            <div>
                                <span style={{ color: "#64748b" }}>Subtotal:</span>
                                <div style={{ fontWeight: "600", color: "#2563eb" }}>₹{order.subtotal}</div>
                            </div>
                        )}
                        {/* Discount */}
                        {order.totalDiscount && order.totalDiscount > 0 && (
                            <div>
                                <span style={{ color: "#64748b" }}>Discount:</span>
                                <div style={{ fontWeight: "600", color: "#10b981" }}>-₹{order.totalDiscount}</div>
                            </div>
                        )}
                        <div>
                            <span style={{ color: "#64748b" }}>Total Amount:</span>
                            <div style={{ fontWeight: "700", color: "#2563eb", fontSize: "1.05rem" }}>₹{order.totalAmount}</div>
                        </div>
                        <div>
                            <span style={{ color: "#64748b" }}>Payment Method:</span>
                            <div style={{ fontWeight: "600" }}>{paymentMethodDisplay}</div>
                        </div>
                        <div>
                            <span style={{ color: "#64748b" }}>Payment Status:</span>
                            <div>
                                <span style={{
                                    padding: "2px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.82rem",
                                    fontWeight: "600",
                                    background: paymentStatusDisplay.toLowerCase().includes("paid") || paymentStatusDisplay.toLowerCase().includes("success") ? "#d1fae5" : "#fef3c7",
                                    color: paymentStatusDisplay.toLowerCase().includes("paid") || paymentStatusDisplay.toLowerCase().includes("success") ? "#065f46" : "#92400e"
                                }}>
                                    {paymentStatusDisplay}
                                </span>
                            </div>
                        </div>
                        {transactionIdDisplay !== "N/A" && (
                            <div style={{ gridColumn: "span 2" }}>
                                <span style={{ color: "#64748b" }}>Transaction ID:</span>
                                <div style={{ fontFamily: "monospace", color: "#334155" }}>{transactionIdDisplay}</div>
                            </div>
                        )}
                        <div style={{ gridColumn: "span 2" }}>
                            <span style={{ color: "#64748b" }}>Delivery Address:</span>
                            <div style={{ color: "#334155" }}>
                                {order.address?.name}, {order.address?.address}, {order.address?.city} - {order.address?.pincode} (📞 {order.address?.phone})
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                    <button
                        onClick={() => navigate(`/invoice/${order._id}`)}
                        className="place-order-btn"
                        style={{ display: "inline-flex", alignItems: "center", gap: "8px", width: "auto", padding: "12px 20px" }}
                    >
                        <FaFileInvoice /> View & Print Invoice
                    </button>

                    <button
                        onClick={() => navigate("/my-orders")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#334155",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        <FaListAlt /> My Orders
                    </button>

                    <button
                        onClick={() => navigate("/books")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#334155",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        <FaShoppingBag /> Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderComplete;