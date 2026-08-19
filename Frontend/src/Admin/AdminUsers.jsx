import { useEffect, useState } from "react"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import { 
  getAllUsers,
  toggelBlockUser,
  delelteUser
} from "../API/userApi";
import "../CSS/AdminUser.css";
import { FaSearch, FaLock, FaLockOpen, FaTrash, FaUsers } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

    
    useEffect(()=>{
      const fetchUser = async() =>{
        try{
          setLoading(true);

          const response = await getAllUsers();

          if(response.success){
            setUsers(response.data);
            setAllUsers(response.data);
          }
        }catch(error){
          console.error("Fetch Error",error);
        }finally{
          setLoading(false);
        }
    }
      fetchUser();
    },[])

    const handleBlock = async(userId) => {
      setActionLoading(userId + "_block");
      try{
        const response = await toggelBlockUser(userId);

        if(response.success){
          setUsers((previousUser)=>
            previousUser.map((user)=>
              user._id === userId
                ?{
                  ...user,
                  isBlocked:
                    response.user.isBlocked
                }
                : user
            )  
          )
        }
      }catch(error){
        console.error("Block/Unblock Error",error);
      }finally{
        setActionLoading(null);
      }
    }

    const hanldeDelete = async(userId) =>{

      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if(!confirmDelete){
        return;
      }
      setActionLoading(userId + "_delete");
      try{
        const response = await delelteUser(userId);

        if(response.success){
          setUsers((previousUser)=>
            previousUser.filter(
                (user)=>
                  user._id !== userId
            )  
          )
        }
      }catch(error){
        console.error("Delete Error",error);
      }finally{
        setActionLoading(null);
      }
    }

    if(loading){
        return (
            <div className="admin-container">
              <AdminSidebar />
              <div className="admin-main">
                <AdminHeader />
                <div className="user-loading">
                  <AiOutlineLoading3Quarters className="spinner-icon" />
                  <h2>Loading users…</h2>
                </div>
              </div>
            </div>
        )
    }

    // Helper: generate avatar initials
    const getInitials = (firstName, lastName) => {
      return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
    };

    const handleSearch = (e) =>{
    const term = e.target.value.toLowerCase();
    if(term === ""){
      setUsers(allUsers);
      return;
    }
    const result = allUsers.filter((item)=>
      item.firstName.toLowerCase().includes(term) ||
      item.lastName.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) 
    );
    setUsers(result);
  }
  return (
    <div className="admin-container">

      <AdminSidebar />

      <div className="admin-main">

        <AdminHeader />
        <div className="users-page">

          {/* Header */}
          <div className="users-header">
              <div>
                  <h1>Users</h1>
                  <p>
                      Manage registered users
                  </p>
              </div>
              <div className="total-users">
                  <span><FaUsers /></span>
                  <div>
                      <small>Total Users</small>

                      <strong>
                          {allUsers.length}
                      </strong>
                  </div>
              </div>
          </div>

          {/* Search */}
          <div className="search-container">
            <FaSearch className="search-icon"/>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email…"
              onChange={handleSearch}
            />
          </div>

          {/* No Users */}
          {users.length === 0 ? (
              <div className="no-users">
                  <h2>No Users Found</h2>
                  <p>
                      No users match your search.
                  </p>
              </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user)=>(
                    <tr key={user._id}>
                      <td>
                        <div className="user-details">
                          <div
                            className="user-avatar"
                            style={{
                              background: user.isBlocked
                                ? "rgba(239,68,68,0.1)"
                                : "rgba(37,99,235,0.1)",
                              color: user.isBlocked ? "#EF4444" : "var(--accent-primary)",
                              border: user.isBlocked
                                ? "1px solid rgba(239,68,68,0.25)"
                                : "1px solid rgba(37,99,235,0.2)"
                            }}
                          >
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <strong>{user.firstName} {user.lastName}</strong>
                        </div>
                      </td>
                      <td className="user-email">{user.email}</td>
                      <td>
                        <span className={`badge badge-role ${user.role === "admin" ? "badge-admin" : "badge-user"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isBlocked ? "badge-blocked" : "badge-active"}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td>
                        {user.role === "user" && (
                          <div className="action-btns">
                            <button
                              className={`btn-action ${user.isBlocked ? "btn-unblock" : "btn-block"}`}
                              onClick={()=>handleBlock(user._id)}
                              disabled={actionLoading === user._id + "_block"}
                              title={user.isBlocked ? "Unblock user" : "Block user"}
                            >
                              {actionLoading === user._id + "_block" ? (
                                <AiOutlineLoading3Quarters className="btn-spinner" />
                              ) : user.isBlocked ? (
                                <><FaLockOpen /> Unblock</>
                              ) : (
                                <><FaLock /> Block</>
                              )}
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={()=>hanldeDelete(user._id)}
                              disabled={actionLoading === user._id + "_delete"}
                              title="Delete user"
                            >
                              {actionLoading === user._id + "_delete" ? (
                                <AiOutlineLoading3Quarters className="btn-spinner" />
                              ) : (
                                <><FaTrash /> Delete</>
                              )}
                            </button>
                          </div>
                        )}
                        {user.role === "admin" && (
                          <span className="admin-protected-label">Protected</span>
                        )}
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
  )
}

export default AdminUsers