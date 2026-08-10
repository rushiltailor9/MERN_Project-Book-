import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"


const AdminOrders = () => {
  return (
    <div className="admin-container">
        <AdminSidebar/>
        <div className="admin-main">
            <AdminHeader/>
            AdminOrders
        </div>
    </div>
  );
}

export default AdminOrders