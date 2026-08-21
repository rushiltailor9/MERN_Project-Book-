import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoice } from "../API/invoiceApi";
import { FaPrint, FaArrowLeft, FaCheckCircle, FaBookOpen } from "react-icons/fa";
import "../CSS/Invoice.css";

function Invoice() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const response = await getInvoice(orderId);
                if (response.success && response.invoice) {
                    setInvoice(response.invoice);
                } else {
                    setErrorMsg(response.message || "Invoice not found");
                }
            } catch (error) {
                console.error("Invoice error:", error);
                setErrorMsg(error.response?.data?.message || "Failed to load invoice");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchInvoice();
        }
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="invoice-screen-container">
                <div className="invoice-loading-box">
                    <div className="invoice-spinner"></div>
                    <h2>Generating Invoice...</h2>
                </div>
            </div>
        );
    }

    if (!invoice || errorMsg) {
        return (
            <div className="invoice-screen-container">
                <div className="invoice-error-box">
                    <h2>Invoice Not Available</h2>
                    <p>{errorMsg || "We couldn't retrieve the invoice for this order."}</p>
                    <button onClick={() => navigate("/my-orders")} className="invoice-btn-primary">
                        <FaArrowLeft /> Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    const subTotalAmount = invoice.subTotal || invoice.subtotal || invoice.totalAmount || 0;
    const isPaid = (invoice.paymentStatus || "").toUpperCase().includes("PAID") || (invoice.paymentStatus || "").toUpperCase().includes("SUCCESS");

    return (
        <div className="invoice-screen-container">
            {/* Screen Controls (Hidden on Print) */}
            <div className="invoice-action-bar no-print">
                <button onClick={() => navigate("/my-orders")} className="invoice-back-btn">
                    <FaArrowLeft /> Back to My Orders
                </button>
                <div className="action-right">
                    <button onClick={handlePrint} className="invoice-print-btn">
                        <FaPrint /> Print / Save as PDF
                    </button>
                </div>
            </div>

            {/* Printable Invoice Paper */}
            <div className="invoice-paper" id="printable-invoice">
                {/* Header */}
                <div className="invoice-header">
                    <div className="invoice-brand">
                        <div className="brand-logo">
                            <FaBookOpen />
                        </div>
                        <div>
                            <h1 className="brand-name">READ-EASY</h1>
                            <p className="brand-tagline">Online Book Store & Digital Publisher</p>
                        </div>
                    </div>

                    <div className="invoice-title-block">
                        <h2 className="doc-title">TAX INVOICE</h2>
                        <div className="invoice-meta-item">
                            <span className="meta-label">Invoice No:</span>
                            <span className="meta-value highlight">{invoice.invoiceNumber}</span>
                        </div>
                        <div className="invoice-meta-item">
                            <span className="meta-label">Date:</span>
                            <span className="meta-value">{new Date(invoice.createdAt || Date.now).toLocaleDateString()}</span>
                        </div>
                        <div className="invoice-meta-item">
                            <span className="meta-label">Order ID:</span>
                            <span className="meta-value font-mono">#{invoice.orderId}</span>
                        </div>
                    </div>
                </div>

                <div className="invoice-divider"></div>

                {/* Billed To & Payment Meta */}
                <div className="invoice-parties-grid">
                    <div className="party-block">
                        <h4 className="party-title">Billed To:</h4>
                        <div className="party-name">{invoice.customerName}</div>
                        {invoice.customerEmail && (
                            <div className="party-detail">✉️ {invoice.customerEmail}</div>
                        )}
                    </div>

                    <div className="party-block payment-meta-block">
                        <h4 className="party-title">Payment Details:</h4>
                        <div className="payment-badge-row">
                            <span className="meta-label">Method:</span>
                            <span className="payment-pill">{invoice.paymentMethod || "COD"}</span>
                        </div>
                        <div className="payment-badge-row">
                            <span className="meta-label">Status:</span>
                            <span className={`status-pill ${isPaid ? "paid" : "pending"}`}>
                                <FaCheckCircle /> {invoice.paymentStatus || (isPaid ? "PAID" : "PENDING")}
                            </span>
                        </div>
                        {invoice.transactionId && invoice.transactionId !== "N/A" && (
                            <div className="payment-badge-row">
                                <span className="meta-label">Transaction ID:</span>
                                <span className="meta-value font-mono">{invoice.transactionId}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="invoice-table-wrapper">
                    <table className="invoice-items-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Description</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Unit Price</th>
                                <th className="text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(invoice.items || []).map((item, index) => {
                                const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                                return (
                                    <tr key={index}>
                                        <td className="item-index">{index + 1}</td>
                                        <td className="item-name">
                                            <strong>{item.bookName}</strong>
                                            {hasDiscount && item.discountPercentage > 0 && (
                                                <span style={{ marginLeft: "8px", fontSize: "0.75rem", background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: "4px", fontWeight: "600" }}>
                                                    {item.discountPercentage}% OFF
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center item-qty">{item.quantity}</td>
                                        <td className="text-right">
                                            {hasDiscount ? (
                                                <>
                                                    <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "0.85rem", marginRight: "6px" }}>₹{item.originalPrice}</span>
                                                    <span>₹{item.price}</span>
                                                </>
                                            ) : (
                                                `₹${item.price}`
                                            )}
                                        </td>
                                        <td className="text-right item-total">₹{item.price * item.quantity}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="invoice-summary-section">
                    <div className="invoice-terms">
                        <h4>Terms & Conditions</h4>
                        <ul>
                            <li>This is a computer-generated tax invoice. No signature required.</li>
                            <li>Standard return and replacement policy applies within 7 days.</li>
                            <li>For support, email us at support@readeasy.com.</li>
                        </ul>
                    </div>

                    <div className="invoice-totals-table">
                        <div className="total-line">
                            <span>Subtotal:</span>
                            <span>₹{subTotalAmount}</span>
                        </div>
                        <div className="total-line">
                            <span>Shipping & Handling:</span>
                            <span className="text-green">FREE</span>
                        </div>
                        {invoice.discount > 0 && (
                            <div className="total-line">
                                <span>Discount:</span>
                                <span>- ₹{invoice.discount}</span>
                            </div>
                        )}
                        <div className="total-divider"></div>
                        <div className="grand-total-line">
                            <span>Grand Total:</span>
                            <span>₹{invoice.totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="invoice-footer">
                    <p>Thank you for choosing <strong>READ-EASY</strong> for your reading journey!</p>
                </div>
            </div>
        </div>
    );
}

export default Invoice;