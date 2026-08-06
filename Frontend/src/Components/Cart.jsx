import { useEffect, useState } from "react";
import "../CSS/Cart.css";
import { deleteCart, getCart, updateQuantity } from "../cartApi";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(Array.isArray(response?.data?.cart) ? response.data.cart : []);
    } catch (error) {
      console.log(error);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateQuantity(id, newQuantity);
      await fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteCart(id);
      await fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">My Cart</h1>
        <p className="cart-total">Total: ₹{totalPrice}</p>
      </div>

      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                className="cart-item-image"
                src={item.bookImg}
                alt={item.bookName}
              />
              <div className="cart-item-details">
                <h3>{item.bookName}</h3>
                <p>{item.authorName}</p>
                <p>₹{item.price}</p>
                <div className="cart-actions">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item._id, Number(item.quantity) - 1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item._id, Number(item.quantity) + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart