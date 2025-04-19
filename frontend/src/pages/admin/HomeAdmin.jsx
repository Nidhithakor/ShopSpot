import React, { useEffect, useState } from "react";
import AdminNavbar from '../../components/admin/AdminNavbar.jsx'
import Sidebar from "../../components/admin/Sidebar.jsx";
import { Routes, Route, Outlet } from "react-router-dom";
import Add from '../../pages/admin/Add.jsx'
import List from '../../pages/admin/List.jsx'
import Orders from '../../pages/admin/Orders.jsx'

import Login from "../../pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import Users from "./Users.jsx";
import Dashboard from "./Dashboard.jsx";
import Review from "./Review.jsx";


export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const HomeAdmin = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className=" min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <AdminNavbar setToken={setToken} />
          <hr />

          <div className="flex w-full ">
            <Sidebar />

            <div className="w-[70%] mx-auto ml-[max(5vw,25px) my-8 text-gray-600 text-base ]">
 
              <Routes>
                <Route path="/" element={<Outlet />}>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="list" element={<List token={token} />} />
                  <Route path="orders" element={<Orders token={token} />} />
                  <Route path="users" element={<Users token={token} />} />
                  <Route path="dashboard" element={<Dashboard token={token} />} />
                  <Route path="reviews" element={<Review token={token} />} />
                </Route>
              </Routes> 
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeAdmin;
