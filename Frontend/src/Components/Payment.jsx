import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createDummyPayment } from "../API/paymentApi";
import { createInvoice } from "../API/invoiceApi";
import { placeOrder } from "../API/orderApi";
import { handleSuccess, handleError } from "../utils";
import "../CSS/Payment.css";
import { FaCreditCard, FaMobileAlt, FaLock, FaShieldAlt, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    // Data from Checkout
    const { totalAmount, orderData } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState(orderData?.address?.name || "Demo Customer");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [upiId, setUpiId] = useState("");
    const [loading, setLoading] = useState(false);

    // If no payment data, return back to checkout
    if (!totalAmount || !orderData) {
        return (
            <div className="payment-empty-container">
                <div className="payment-card payment-empty-box">
                    <h2>⚠️ No Payment Information Found</h2>
                    <p>Please select items and proceed to checkout before visiting the payment gateway.</p>
                    <Link to="/checkout" className="btn-primary-payment">
                        <FaArrowLeft /> Back to Checkout
                    </Link>
                </div>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();

        // Validation
        if (paymentMethod === "dummy_card") {
            if (!cardNumber.trim() || !cardName.trim() || !expiry.trim() || !cvv.trim()) {
                handleError("Please fill all card details");
                return;
            }
        } else if (paymentMethod === "dummy_upi") {
            if (!upiId.trim() || !upiId.includes("@")) {
                handleError("Please enter a valid dummy UPI ID (e.g. name@upi)");
                return;
            }
        }

        try {
            setLoading(true);

            // 1. Process Dummy Payment
            const paymentResponse = await createDummyPayment({
                amount: totalAmount,
                paymentMethod: paymentMethod,
                paymentResult: "success"
            });

            if (!paymentResponse.success) {
                handleError(paymentResponse.message || "Payment authorization failed");
                return;
            }

            const payment = paymentResponse.payment;

            // 2. Place Order in Backend
            const orderPayload = {
                ...orderData,
                paymentMethod: paymentMethod === "dummy_upi" ? "dummy_upi" : "dummy_card",
                paymentStatus: "paid",
                transactionId: payment.transactionId
            };

            const orderResponse = await placeOrder(orderPayload);

            if (!orderResponse.success) {
                handleError("Payment succeeded but order creation failed: " + (orderResponse.message || ""));
                return;
            }

            const order = orderResponse.order;

            // 3. Create Invoice
            let invoice = null;
            try {
                const invoiceResponse = await createInvoice({
                    orderId: order._id,
                    payment: payment
                });
                if (invoiceResponse.success) {
                    invoice = invoiceResponse.invoice;
                }
            } catch (invErr) {
                console.warn("Invoice auto-generation warning:", invErr);
            }

            // 4. Clear Cart
            localStorage.removeItem("cart");
            handleSuccess("Payment Successful! Order Confirmed.");

            // 5. Navigate to Order Complete
            navigate("/order-complete", {
                state: {
                    order,
                    payment,
                    invoice: invoice || {
                        invoiceNumber: "INV-" + Date.now(),
                        totalAmount: order.totalAmount,
                        paymentMethod: payment.paymentMethod,
                        paymentStatus: "PAID",
                        transactionId: payment.transactionId
                    }
                }
            });

        } catch (error) {
            console.error("Payment process error:", error);
            handleError(error.response?.data?.message || error.message || "Payment processing error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-page-container">
            <div className="payment-wrapper">
                {/* Header */}
                <div className="payment-header-section">
                    <button onClick={() => navigate("/checkout")} className="back-link-btn">
                        <FaArrowLeft /> Back to Checkout
                    </button>
                    <h1>Secure Checkout Gateway</h1>
                    <div className="secure-badge">
                        <FaShieldAlt className="shield-icon" /> 256-bit Encrypted Simulated Gateway
                    </div>
                </div>

                <div className="payment-grid">
                    {/* Payment Form Left */}
                    <div className="payment-form-card">
                        <h2>Select Payment Method</h2>
                        
                        <div className="payment-tabs">
                            <button
                                type="button"
                                className={`payment-tab ${paymentMethod === "dummy_card" ? "active" : ""}`}
                                onClick={() => setPaymentMethod("dummy_card")}
                            >
                                <FaCreditCard /> Credit / Debit Card
                            </button>
                            <button
                                type="button"
                                className={`payment-tab ${paymentMethod === "dummy_upi" ? "active" : ""}`}
                                onClick={() => setPaymentMethod("dummy_upi")}
                            >
                                <FaMobileAlt /> Instant UPI / QR
                            </button>
                        </div>

                        <form onSubmit={handlePayment} className="payment-active-form">
                            {paymentMethod === "dummy_card" && (
                                <div className="card-payment-fields">
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="text"
                                                placeholder="4532 •••• •••• 6789"
                                                maxLength="19"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                required
                                            />
                                            <FaCreditCard className="field-icon" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name as on Card"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label>Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                placeholder="12/28"
                                                maxLength="5"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV / CVC</label>
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                maxLength="4"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="demo-hint-box">
                                        <FaCheckCircle /> Demo card details pre-filled. Click Pay to simulate live payment.
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "dummy_upi" && (
                                <div className="upi-payment-fields">
                                    <div className="form-group">
                                        <label>Virtual Payment Address (UPI ID)</label>
                                        <input
                                            type="text"
                                            placeholder="example@okaxis / mobile@upi"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="demo-hint-box">
                                        <FaCheckCircle /> Demo UPI ID prefilled. Click Pay to simulate live instant approval.
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="pay-now-btn"
                                disabled={loading}
                            >
                                <FaLock /> {loading ? "Authorizing Payment..." : `Pay Securely ₹${totalAmount}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Right */}
                    <div className="payment-summary-card">
                        <h3>Order Summary</h3>
                        
                        <div className="summary-items-list">
                            {orderData.items?.map((item, idx) => (
                                <div key={idx} className="summary-book-row">
                                    {item.bookImg && (
                                        <img src={item.bookImg} alt={item.bookName} className="summary-thumb" />
                                    )}
                                    <div className="summary-book-info">
                                        <h4>{item.bookName}</h4>
                                        <p>Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <span className="summary-book-subtotal">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-address-preview">
                            <h4>Delivering To:</h4>
                            <p><strong>{orderData.address?.name}</strong></p>
                            <p>{orderData.address?.address}, {orderData.address?.city} - {orderData.address?.pincode}</p>
                            <p>📞 {orderData.address?.phone}</p>
                        </div>

                        <div className="summary-pricing-breakdown">
                            <div className="price-row">
                                <span>Subtotal</span>
                                <span>₹{orderData.subtotal !== undefined ? orderData.subtotal : totalAmount}</span>
                            </div>
                            {orderData.totalDiscount > 0 && (
                                <div className="price-row">
                                    <span>Discount Saved</span>
                                    <span style={{ color: "#16a34a", fontWeight: "600" }}>-₹{orderData.totalDiscount}</span>
                                </div>
                            )}
                            <div className="price-row">
                                <span>Estimated Delivery</span>
                                <span className="free-text">FREE</span>
                            </div>
                            <div className="price-divider"></div>
                            <div className="price-row total-row">
                                <span>Total Amount:</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;