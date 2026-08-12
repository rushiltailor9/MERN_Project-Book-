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
        
        <div style={{ padding: "30px", color: "#f8fafc" }}>
          <h1 style={{ marginBottom: "20px" }}>Manage Customer Orders</h1>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ background: "#111", padding: "30px", borderRadius: "12px", textAlign: "center" }}>
              <h3>No orders placed yet.</h3>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#111", borderRadius: "12px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#1f2937", color: "#cbd5e1", textAlign: "left", fontSize: "0.9rem" }}>
                    <th style={{ padding: "15px" }}>Order ID</th>
                    <th style={{ padding: "15px" }}>Customer / Phone</th>
                    <th style={{ padding: "15px" }}>Items</th>
                    <th style={{ padding: "15px" }}>Amount</th>
                    <th style={{ padding: "15px" }}>Payment</th>
                    <th style={{ padding: "15px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: "1px solid #1f2937", fontSize: "0.9rem" }}>
                      <td style={{ padding: "15px", fontFamily: "monospace" }}>#{order._id.substring(0, 10)}...</td>
                      <td style={{ padding: "15px" }}>
                        <strong>{order.address?.name || "N/A"}</strong>
                        <br />
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>📞 {order.address?.phone || "N/A"}</span>
                        <br />
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>📍 {order.address?.city}</span>
                      </td>
                      <td style={{ padding: "15px" }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: "4px" }}>
                            {item.bookName} (x{item.quantity})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: "15px", fontWeight: "700", color: "#38bdf8" }}>
                        ₹{order.totalAmount}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "4px", background: "#374151", fontSize: "0.8rem" }}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <select
                          value={order.orderStatus || "Pending"}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: "#1f2937",
                            color: "#f8fafc",
                            border: "1px solid #4b5563",
                            cursor: "pointer"
                          }}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;