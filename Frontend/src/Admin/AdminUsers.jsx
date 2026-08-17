import { useEffect, useState } from "react"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import { getUsers } from "../API/userApi";
import "../CSS/AdminUser.css";
import { FaSearch } from "react-icons/fa";


const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

    
    useEffect(()=>{
      const fetchUser = async() =>{
        try{
            const response = await getUsers();
            console.log(response.data)
            setUsers(response.data);
            setAllUsers(response.data);
        }catch(error){
            console.log(error);
            setUsers([]);
            setAllUsers([]);
        }finally{
            setLoading(false);
        }
    }
      fetchUser();
    },[])
    if(loading){
        return (
            <div className="admin-loading">
                Loading 
            </div>
        )
    }
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
          <div className="search-container">
            <FaSearch className="search-icon"/>
            <input
              type="text"
              className="search-input"
              placeholder="Search orders..."
              onChange={handleSearch}
            />
          </div>

          {/* Header */}
          <div className="users-header">
              <div>
                  <h1>Users</h1>
                  <p>
                      Manage registered users
                  </p>
              </div>
              <div className="total-users">
                  <span>👥</span>
                  <div>
                      <small>Total Users</small>

                      <strong>
                          {users.length}
                      </strong>
                  </div>
              </div>
          </div>

            {/* No Users */}
          {users.length === 0 ? (
              <div className="no-users">
                  <h2>No Users Found</h2>
                  <p>
                      There are no registered users.
                  </p>
              </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>
                          {index + 1}
                      </td>
                      <td>
                          <div className="user-details">
                              <div className="user-avatar">
                                  {user.firstName
                                      ? user.firstName
                                          .charAt(0)
                                          .toUpperCase()
                                      : "U"}
                              </div>
                              <strong>
                                  {user.name}
                              </strong>
                          </div>
                      </td>
                      <td>
                          {user.email}
                      </td>
                      <td>
                          {user.firstName}
                      </td>
                      <td>
                          {user.lastName}
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