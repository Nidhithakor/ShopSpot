import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../../components/Title";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Users = ({ token }) => {
  const [user, setUser] = useState([]);

  // Fetch all users
  const fetchUser = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/all",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setUser(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }
  };

  // Remove User
  const removeUser = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchUser(); // Refresh user list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove user");
    }
  };

  // Update User Role
  const editUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/user/updaterole",
        { userId, role: newRole },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("User role updated successfully!");
        fetchUser(); // Refresh user list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user role");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="text-2xl">
        <Title text1={"Registered"} text2={" Users"} />
      </div>

      <div className="flex flex-col gap-2">
        {/* Table Headers */}
        <div className="items-center py-1 px-2 border bg-gray-100 text-sm md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr]">
          <b className="text-base">Name</b>
          <b className="text-base">Email</b>
          <b className="text-base">Role</b>
          <b className="text-center text-base">Action</b>
        </div>

        {/* User List */}
        {user.map((item, index) => (
          <div
            className="items-center gap-2 border text-base grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr]"
            key={index}
          >
            <p className="p-2">{item.name}</p>
            <p>{item.email}</p>

            {/* Role Selection Dropdown */}
            <select
              value={item.role}
              onChange={(e) => editUserRole(item._id, e.target.value)}
              className="p-1 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="user">User</option>
            </select>

            {/* Remove User */}
            <p
              onClick={() => removeUser(item._id)}
              className="text-right md:text-center cursor-pointer text-lg text-red-500"
            >
              ❌
            </p>

            {/* Edit Button Removed (Dropdown auto-saves change) */}
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
