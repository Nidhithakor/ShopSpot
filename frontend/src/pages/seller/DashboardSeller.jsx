import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
// import { backendUrl } from "./List";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState([]);
  const [orderCount, setOrderCount] = useState([]);

  const backendUrl = "http://localhost:4000";
  // Fetch all products added by this seller
  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/product/seller-products",
        {
          headers: {
            token: localStorage.getItem("token"), // Ensure authentication
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        setProducts(response.data.products);
        setProductCount(response.data.productCount);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    }
  };

  // get orders of the product added by seller
 
  const fetchSellerOrders = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/order/seller-orders",
        {
          headers: {
            token: localStorage.getItem("token"), // Ensure authentication
          },
        }
      );

      // console.log("Orders Response:", response); 

      if (response.data.success) {
        setOrders(response.data.orders);

        setOrderCount(response.data.orderCount); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchSellerProducts();
    fetchSellerOrders();
  }, []);

  return (
    <div>
      <div className="text-2xl">
        <Title text1=" " text2=" Dashboard " />
      </div>

      {/* ✅ Consistent size and spacing */}
      <div className="flex flex-row items-center justify-center gap-6 mt-6">
        {/* Products */}
        <div className="w-64 h-32 flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
          <h5 className="text-xl font-semibold text-center">Total Products</h5>
          <p className="text-center text-2xl">{productCount} </p>
        </div>

        {/* Orders */}
        <div className="w-64 h-32 flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
          <h5 className="text-xl font-semibold text-center">Total Orders</h5>
          <p className="text-center text-2xl">{orderCount}</p>
          {/* ✅ Display orders */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
