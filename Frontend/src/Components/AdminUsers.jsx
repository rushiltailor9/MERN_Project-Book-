import AdminHeader from "../Admin/AdminHeader"
import AdminSidebar from "../Admin/AdminSidebar"


const AdminUsers = () => {
  return (
    <div className="admin-container">
        <AdminSidebar/>
        <div className="admin-main">
            <AdminHeader/>
            AdminUser
        </div>
    </div>
  )
}

export default AdminUsers