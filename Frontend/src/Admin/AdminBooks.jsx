import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"


const AdminBooks = () => {
  return (
    <div className="admin-container">
        <AdminSidebar/>
        <div className="admin-main">
            <AdminHeader/>
            AdminBooks
        </div>
    </div>
    
  )
}

export default AdminBooks