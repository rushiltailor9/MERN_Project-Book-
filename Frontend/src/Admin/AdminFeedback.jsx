import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"


const AdminFeedback = () => {
  return (
    <div className="admin-container">
        <AdminSidebar/>
        <div className="admin-main">
            <AdminHeader/>
            AdminFeedback
        </div>
    </div>
  )
}

export default AdminFeedback