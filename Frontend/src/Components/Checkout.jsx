import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Checkout.css";
import { placeOrder } from "../API/orderApi";
import { getCart } from "../API/cartApi";
import { getAllDiscount } from "../API/discountApi";
import { handleSuccess, handleError } from "../utils";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);
  const [discounts, setDiscounts] = useState([]);

  const [formData, setFormData] = useState({
    name: localStorage.getItem("name") || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD"
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setFetchingCart(true);
        const response = await getCart();
        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCart(localCart);
        }
      } catch (error) {
        console.error("Error loading cart for checkout:", error);
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(localCart);
      } finally {
        setFetchingCart(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getAllDiscount();
        if (response.success) setDiscounts(response.discounts || []);
      } catch (error) {
        console.error("Error loading discounts for checkout:", error);
      }
    };

    fetchDiscounts();
  }, []);

  const getItemPricing = (item) => {
    const bookId = item.bookId?._id || item.bookId;
    const originalPrice = Number(item.price || item.bookId?.price || 0);
    const now = new Date();
    const discount = discounts.find((entry) => {
      const appliesToBook = entry.bookId?._id === bookId;
      const appliesToAll = !entry.bookId;
      return (appliesToBook || appliesToAll) &&
        entry.isActive &&
        new Date(entry.startDate) <= now &&
        new Date(entry.endDate) >= now;
    });
    const discountPercentage = Number(discount?.discountPercentage || 0);
    const price = Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2));

    return { originalPrice, price, discountPercentage };
  };

  const totalAmount = cart.reduce((total, item) => {
    const { price } = getItemPricing(item);
    return total + price * item.quantity;
  }, 0);

  const subtotalAmount = cart.reduce((total, item) => {
    const { originalPrice } = getItemPricing(item);
    return total + originalPrice * item.quantity;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Please login to place an order");
      navigate("/login");
      return false;
    }

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      handleError("Please fill in all delivery details");
      return false;
    }

    if (cart.length === 0) {
      handleError("Your cart is empty");
      return false;
    }

    return true;
  };

  const getFormattedItems = () => {
    return cart.map((item) => {
      const { originalPrice, price, discountPercentage } = getItemPricing(item);
      const discountAmount = Number((originalPrice - price).toFixed(2));
      return {
        bookId: item.bookId?._id || item.bookId,
        bookName: item.bookName || item.bookId?.bookName || "Book",
        originalPrice,
        price,
        discountPercentage,
        discountAmount,
        quantity: item.quantity,
        bookImg: item.bookImg || item.bookId?.bookImg || ""
      };
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formattedAddress = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim()
    };

    const formattedItems = getFormattedItems();
    const discountTotal = Number((subtotalAmount - totalAmount).toFixed(2));

    // If online payment, navigate to payment page
    if (formData.paymentMethod === "ONLINE") {
      navigate("/payment", {
        state: {
          totalAmount: totalAmount,
          subtotalAmount: subtotalAmount,
          totalDiscount: discountTotal > 0 ? discountTotal : 0,
          orderData: {
            items: formattedItems,
            subtotal: subtotalAmount,
            totalDiscount: discountTotal > 0 ? discountTotal : 0,
            totalAmount: totalAmount,
            address: formattedAddress,
            paymentMethod: "ONLINE"
          }
        }
      });
      return;
    }

    // Otherwise place COD order
    try {
      setLoading(true);

      const orderData = {
        items: formattedItems,
        subtotal: subtotalAmount,
        totalDiscount: discountTotal > 0 ? discountTotal : 0,
        totalAmount: totalAmount,
        address: formattedAddress,
        paymentMethod: "COD"
      };

      const response = await placeOrder(orderData);

      if (response.success) {
        handleSuccess("Order Placed Successfully!");
        localStorage.removeItem("cart");
        navigate("/order-complete", { 
          state: { 
            order: response.order,
            payment: {
              paymentMethod: "Cash On Delivery (COD)",
              paymentStatus: "Pending",
              transactionId: "N/A"
            },
            invoice: {
              invoiceNumber: "INV-" + Date.now()
            }
          } 
        });
      } else {
        handleError(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Place Order Error:", error);
      handleError(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCart) {
    return (
      <div className="checkout-page">
        <div style={{ textAlign: "center", padding: "50px", color: "#222" }}>
          <h2>Loading Checkout...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT COLUMN: Shipping & Payment */}
        <div className="checkout-left">
          <h1>Checkout</h1>
          <p className="checkout-subtitle">Complete your purchase details</p>

          <div className="checkout-card">
            <h2>Delivery Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <textarea
                name="address"
                placeholder="Enter full street address, house no., building name"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Payment Method</h2>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === "COD"}
                onChange={handleChange}
              />
              <span> Cash On Delivery (COD)</span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={formData.paymentMethod === "ONLINE"}
                onChange={handleChange}
              />
              <span> Online Payment / UPI / NetBanking</span>
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item) => {
                const title = item.bookName || item.bookId?.bookName || "Book";
                const { originalPrice, price, discountPercentage } = getItemPricing(item);
                const itemId = item._id || item.bookId?._id || item.bookId;

                return (
                  <div className="summary-item" key={itemId}>
                    <div>
                      <h4>{title}</h4>
                      <p>
                        {discountPercentage > 0 && <del>₹{originalPrice}</del>} ₹{price} × {item.quantity}
                      </p>
                    </div>
                    <strong>₹{price * item.quantity}</strong>
                  </div>
                );
              })
            )}

            <div className="summary-divider"></div>

            {subtotalAmount > totalAmount && (
              <div className="summary-total">
                <span>Discount:</span>
                <strong>-₹{(subtotalAmount - totalAmount).toFixed(2)}</strong>
              </div>
            )}

            <div className="summary-total">
              <span>Total Payable:</span>
              <strong>₹{totalAmount}</strong>
            </div>

            <button
              className="place-order-btn"
              onClick={handleSubmit}
              disabled={loading || cart.length === 0}
            >
              {loading
                ? "Processing..."
                : formData.paymentMethod === "ONLINE"
                ? "Proceed to Online Payment →"
                : "Confirm & Place Order (COD)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;