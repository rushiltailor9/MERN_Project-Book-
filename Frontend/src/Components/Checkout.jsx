import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Checkout.css";
import { placeOrder } from "../API/orderApi";
import { getCart } from "../API/cartApi";
import { handleSuccess, handleError } from "../utils";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);

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

  const totalAmount = cart.reduce((total, item) => {
    const price = item.price || item.bookId?.price || 0;
    return total + price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Please login to place an order");
      navigate("/login");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      handleError("Please fill in all delivery details");
      return;
    }

    if (cart.length === 0) {
      handleError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.map((item) => ({
          bookId: item.bookId?._id || item.bookId,
          bookName: item.bookName || item.bookId?.bookName || "Book",
          price: item.price || item.bookId?.price || 0,
          quantity: item.quantity,
          bookImg: item.bookImg || item.bookId?.bookImg || ""
        })),
        totalAmount: totalAmount,
        address: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim()
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await placeOrder(orderData);

      if (response.success) {
        handleSuccess("Order Placed Successfully!");
        localStorage.removeItem("cart");
        navigate("/order-success", { state: { order: response.order } });
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
                const price = item.price || item.bookId?.price || 0;
                const itemId = item._id || item.bookId?._id || item.bookId;

                return (
                  <div className="summary-item" key={itemId}>
                    <div>
                      <h4>{title}</h4>
                      <p>₹{price} × {item.quantity}</p>
                    </div>
                    <strong>₹{price * item.quantity}</strong>
                  </div>
                );
              })
            )}

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total Payable:</span>
              <strong>₹{totalAmount}</strong>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading || cart.length === 0}
            >
              {loading ? "Placing Order..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;