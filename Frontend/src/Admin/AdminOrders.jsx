import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { getAllOrders, updateOrderStatus } from "../API/orderApi";
import { handleSuccess, handleError } from "../utils";
import "../CSS/Admin.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        if (response.success && response.orders) {
          setOrders(response.orders);
        }
      } catch (error) {
        console.error("Error fetching admin orders:", error);
        handleError(error.response?.data?.message || "Failed to load admin orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        handleSuccess(`Order status updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      handleError(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <div className="page-header">
            <h1>Manage Customer Orders</h1>
            <p className="welcome-text">Track, manage, and update live customer fulfillment statuses.</p>
          </div>

          {loading ? (
            <div className="admin-loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="dashboard-section empty-orders">
              <h3>No orders placed yet.</h3>
            </div>
          ) : (
            <div className="table-section">
              <div className="table-wrapper">
                <table className="books-table orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer / Phone</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="order-id">#{order._id.substring(0, 10)}...</td>
                        <td className="customer-info">
                          <strong>{order.address?.name || "N/A"}</strong>
                          <span className="info-sub"> ☎ {order.address?.phone || "N/A"}</span>
                          <span className="info-sub">📍 {order.address?.city || "N/A"}</span>
                        </td>
                        <td className="order-items">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              {item.bookName} <span className="item-qty">(x{item.quantity})</span>
                            </div>
                          ))}
                        </td>
                        <td className="order-amount">₹{order.totalAmount}</td>
                        <td>
                          <span className="payment-badge">{order.paymentMethod}</span>
                        </td>
                        <td>
                          <select
                            className={`status-select status-${(order.orderStatus || "Pending").toLowerCase()}`}
                            value={order.orderStatus || "Pending"}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;