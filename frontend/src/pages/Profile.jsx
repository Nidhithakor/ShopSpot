

import React, { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import {backendUrl} from '../pages/admin/List'
import { toast } from "react-toastify";

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/updateprofile`, // Change to your actual API endpoint
        { name, email },
        { headers: { token } }
      );

      if (response.status === 200) {
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      <div className="text-center py-8 text-3xl">
        <Title text1={"My "} text2={" Profile"} />
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3 min-w-72">
              <p className="text-sm font-medium text-gray-700 mb-2">Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                disabled={!isEditing}
              />
            </div>
            <div className="mb-3 min-w-72">
              <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                disabled={!isEditing}
              />
            </div>
            <button
              className="mt-2 w-full px-4 py-2 rounded-md text-white bg-black"
              type="button"
              onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
