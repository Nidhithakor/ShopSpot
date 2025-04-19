import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
import { backendUrl } from "./List";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [orders, setTotalOrders] = useState(0);
  const [users, setTotalUsers] = useState(0);
  const [products, setTotalProducts] = useState(0);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/order/list", {});

      if (response.data.success) {
        setTotalOrders(response.data.totalOrders); // ✅ Correctly setting state
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const fetchAllUsers = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/user/all", {});

      if (response.data.success) {
        
        setTotalUsers(response.data.userCount); 
      
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

   const fetchAllProduct = async () => {
     try {
       const response = await axios.get(backendUrl + "/api/product/list", {});

       if (response.data.success) {
         setTotalProducts(response.data.productCount);
       } else {
         toast.error(response.data.message);
       }
     } catch (error) {
       console.log(error);
       toast.error(error.message);
     }
   };

  

  useEffect(() => {
    fetchAllOrders();
    fetchAllUsers();
    fetchAllProduct();
  }, []);

  return (
    <div>
      <div className="text-2xl">
        <Title text1="Admin" text2=" Dashboard " />
      </div>

      {/* ✅ Consistent size and spacing */}
      <div className="flex flex-row items-center justify-center gap-6 mt-6">
        {/* Users */}
        <div className="w-64 h-32 flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
          <h5 className="text-xl font-semibold text-center">
            Registered Users
          </h5>
          <p className="text-center text-2xl">{users}</p>
        </div>

        {/* Orders */}
        <div className="w-64 h-32 flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
          <h5 className="text-xl font-semibold text-center">Total Orders</h5>
          <p className="text-center text-2xl">{orders}</p>{" "}
          {/* ✅ Display orders */}
        </div>

        {/* Products */}
        <div className="w-64 h-32 flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
          <h5 className="text-xl font-semibold text-center">Total Products</h5>
          <p className="text-center text-2xl">{products}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
