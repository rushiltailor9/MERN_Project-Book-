import "../CSS/Admin.css";
import AdminNotification from "./AdminNotification";

const AdminHeader = () => {

    const name = localStorage.getItem("name") || "Admin";
  return (
        <header className="admin-header">

            <div>
                <h2>Admin Panel</h2>
            </div>

            <div className="admin-profile">

                <AdminNotification />

                <div className="admin-avatar">
                    A
                </div>

                <span>
                    {name}
                </span>

            </div>

        </header>
  )
}

export default AdminHeader
