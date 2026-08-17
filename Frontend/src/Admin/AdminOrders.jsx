import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { getAllOrders, updateOrderStatus } from "../API/orderApi";
import { handleSuccess, handleError } from "../utils";
import "../CSS/Admin.css";
import { FaSearch } from "react-icons/fa";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        if (response.success && response.orders) {
          setOrders(response.orders);
          setAllOrders(response.orders);
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
        const updatedOrder = response.order || { _id: orderId, orderStatus: newStatus };

        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus || newStatus } : order
          )
        );
        setAllOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus || newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      handleError(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.trim().toLowerCase();

    if (term === "") {
      setOrders(allOrders);
      return;
    }

    const result = allOrders.filter((order) => {
      const customerName = (order.address?.name || "").toLowerCase();
      const customerPhone = (order.address?.phone || "").toLowerCase();
      const customerCity = (order.address?.city || "").toLowerCase();
      const paymentMethod = (order.paymentMethod || "").toLowerCase();
      const status = (order.orderStatus || "").toLowerCase();
      const orderId = String(order._id || "").toLowerCase();
      const itemsText = (order.items || [])
        .map((item) => `${item.bookName || ""} ${item.quantity || ""}`)
        .join(" ")
        .toLowerCase();

      return (
        orderId.includes(term) ||
        customerName.includes(term) ||
        customerPhone.includes(term) ||
        customerCity.includes(term) ||
        paymentMethod.includes(term) ||
        status.includes(term) ||
        itemsText.includes(term) ||
        String(order.totalAmount || "").includes(term)
      );
    });

    setOrders(result);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search orders..."
                  onChange={handleSearch}
                />
          </div>
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
                      <th>Customer / Phone / City</th>
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
                          <strong>{order.address?.name || "N/A"}</strong><br/>
                          <span className="info-sub">  {order.address?.phone || "N/A"}</span>
                          <span className="info-sub"> | {order.address?.city || "N/A"}</span>
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