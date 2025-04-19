import React, { useEffect, useState } from "react";
import NavbarSeller from "../../components/seller/NavbarSeller.jsx";
import SidebarSeller from "../../components/seller/SidebarSeller.jsx";
import { Routes, Route, Outlet } from "react-router-dom";
import AddSeller from "../../pages/seller/AddSeller.jsx";
import ListSeller from "../../pages/seller/ListSeller.jsx";
import OrdersSeller from "../../pages/seller/OrdersSeller.jsx";

import Login from "../../pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import DashboardSeller from "./DashboardSeller.jsx";
import ReviewSeller from "./ReviewSeller.jsx";

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
          <NavbarSeller setToken={setToken} />
          <hr />

          <div className="flex w-full ">
            <SidebarSeller />

            <div className="w-[70%] mx-auto ml-[max(5vw,25px) my-8 text-gray-600 text-base ]">
              <Routes>
                <Route path="/" element={<Outlet />}>
                  <Route path="add" element={<AddSeller token={token} />} />
                  <Route path="list" element={<ListSeller token={token} />} />
                  <Route
                    path="orders"
                    element={<OrdersSeller token={token} />}
                  />
                
                  <Route
                    path="dashboard"
                    element={<DashboardSeller token={token} />}
                  />
                  <Route
                    path="reviews"
                    element={<ReviewSeller token={token} />}
                  />
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
